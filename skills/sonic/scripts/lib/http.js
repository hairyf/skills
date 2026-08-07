import http from "node:http";
import https from "node:https";
import tls from "node:tls";

import { PROXY_URL } from "./config.js";

// Hosts that must bypass the proxy (comma-separated, supports "*.example.com" / "host:port")
const NO_PROXY = (process.env.NO_PROXY || process.env.no_proxy || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function shouldBypassProxy(target) {
  const host = target.hostname.toLowerCase();
  const port = String(target.port || (target.protocol === "https:" ? "443" : "80"));
  return NO_PROXY.some((entry) => {
    if (entry === "*") return true;
    if (entry.includes(":")) {
      const [h, p] = entry.split(":");
      return host === h && port === p;
    }
    if (entry.startsWith(".")) return host.endsWith(entry);
    return host === entry || host.endsWith("." + entry);
  });
}

/**
 * HTTP request through a CONNECT tunnel (HTTPS_PROXY), zero-dependency.
 */
function requestViaProxy(targetUrl, { method = "GET", headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const target = new URL(targetUrl);
    const proxy = new URL(PROXY_URL);
    const targetHost = `${target.hostname}:${target.port || 443}`;
    const connectReq = http.request({
      host: proxy.hostname,
      port: proxy.port,
      method: "CONNECT",
      path: targetHost,
      headers: { Host: targetHost },
    });

    connectReq.on("error", reject);
    connectReq.on("connect", (res, socket) => {
      if (res.statusCode !== 200) {
        socket.destroy();
        reject(new Error(`Proxy CONNECT failed [${res.statusCode}]`));
        return;
      }

      const tlsSocket = tls.connect({ socket, servername: target.hostname }, () => {
        const req = https.request(
          {
            createConnection: () => tlsSocket,
            host: target.hostname,
            port: target.port || 443,
            method,
            path: `${target.pathname}${target.search}`,
            headers,
          },
          (res2) => {
            const chunks = [];
            res2.on("data", (chunk) => chunks.push(chunk));
            res2.on("end", () => {
              resolve({
                ok: res2.statusCode >= 200 && res2.statusCode < 300,
                status: res2.statusCode,
                buffer: Buffer.concat(chunks),
              });
            });
          },
        );
        req.on("error", reject);
        if (body) req.write(body);
        req.end();
      });

      tlsSocket.on("error", reject);
    });
    connectReq.end();
  });
}

/**
 * Unified HTTP request — native fetch, or through the proxy when configured.
 */
export async function request(url, { method = "POST", headers = {}, body } = {}) {
  const target = new URL(url);
  const isLocal = ["127.0.0.1", "localhost", "::1"].includes(target.hostname);
  if (PROXY_URL && !isLocal && !shouldBypassProxy(target)) {
    return requestViaProxy(url, { method, headers, body });
  }
  const response = await fetch(url, { method, headers, body });
  return {
    ok: response.ok,
    status: response.status,
    buffer: Buffer.from(await response.arrayBuffer()),
  };
}

/**
 * POST a JSON payload and return the parsed response.
 */
export async function postJson(url, headers, body) {
  const res = await request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const rawText = res.buffer.toString("utf-8");
  if (!res.ok) {
    let detail = rawText;
    try {
      detail = JSON.parse(rawText)?.error?.message || JSON.parse(rawText)?.message || rawText;
    } catch {
      // keep raw text
    }
    throw new Error(`API error [${res.status}]: ${String(detail).slice(0, 300)}`);
  }
  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error(`Invalid JSON response: ${rawText.slice(0, 300)}`);
  }
}

/**
 * Download a URL into a Buffer.
 */
export async function fetchBuffer(url, headers = {}) {
  const res = await request(url, { method: "GET", headers });
  if (!res.ok) {
    throw new Error(`Download failed [${res.status}] for ${url.slice(0, 120)}`);
  }
  return res.buffer;
}

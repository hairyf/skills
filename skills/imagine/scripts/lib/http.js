import http from "node:http";
import https from "node:https";
import tls from "node:tls";

import { PROXY_URL } from "./config.js";

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
  if (PROXY_URL) {
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
 * Build a multipart/form-data body as a Buffer (works with fetch and proxy tunnel).
 */
export function buildMultipart(fields, files) {
  const boundary = `----imagine-${Date.now().toString(36)}`;
  const chunks = [];
  const push = (str) => chunks.push(Buffer.from(str));

  for (const [key, value] of Object.entries(fields)) {
    push(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`);
  }
  for (const [name, { filename, data, type }] of Object.entries(files)) {
    push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: ${type}\r\n\r\n`,
    );
    chunks.push(data);
    push("\r\n");
  }
  push(`--${boundary}--\r\n`);

  return {
    body: Buffer.concat(chunks),
    contentType: `multipart/form-data; boundary=${boundary}`,
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
    throw new Error(`API error [${res.status}]: ${rawText.slice(0, 300)}`);
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

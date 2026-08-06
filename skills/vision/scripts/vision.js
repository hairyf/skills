#!/usr/bin/env node
/**
 * Standalone vision script — calls a Qwen VL model (ESM, zero-dependency)
 *
 * Usage:
 *   node vision.js <image path> [question]
 *   node vision.js --url <image url> [question]
 *
 * Configuration:
 *   Set the API key via the DASHSCOPE_API_KEY environment variable
 *   or a .env file in the same directory.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Current module directory in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Lightweight .env parser (replaces the dotenv dependency)
 * @param {string} filePath
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) continue;

      const delimiterIdx = trimmed.indexOf("=");
      if (delimiterIdx === -1) continue;

      const key = trimmed.slice(0, delimiterIdx).trim();
      let value = trimmed.slice(delimiterIdx + 1).trim();

      // Strip surrounding quotes (" or ')
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Only set when the env var is not already defined (don't override system vars)
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore read or parse failures
  }
}

// Load .env from the current working directory and the script directory
loadEnvFile(path.resolve(process.cwd(), ".env"));
loadEnvFile(path.resolve(__dirname, ".env"));

// Configuration
const BASE_URL = process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const API_KEY = process.env.DASHSCOPE_API_KEY || "";
const MODEL = process.env.VISION_MODEL || "qwen-vl-max";

// Common image extensions -> MIME type map
const MIME_MAP = Object.freeze({
  jpg: "jpeg",
  jpeg: "jpeg",
  png: "png",
  gif: "gif",
  webp: "webp",
  bmp: "bmp",
});

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  let imageSource = "";
  let isUrl = false;
  const promptParts = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--url" && argv[i + 1]) {
      isUrl = true;
      imageSource = argv[++i];
    } else if (!imageSource && !arg.startsWith("--")) {
      imageSource = arg;
    } else if (imageSource && !arg.startsWith("--")) {
      promptParts.push(arg);
    }
  }

  const prompt = promptParts.join(" ") || "Describe the content of this image in detail.";
  return { imageSource, prompt, isUrl };
}

/**
 * Resolve the image source (local file to base64, or remote URL)
 */
function resolveImageUrl(source, isUrl) {
  if (isUrl) return source;

  const resolvedPath = path.resolve(source);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`);
  }

  const ext = path.extname(resolvedPath).toLowerCase().replace(".", "");
  const mimeType = MIME_MAP[ext] || "jpeg";
  const fileBuffer = fs.readFileSync(resolvedPath);

  return `data:image/${mimeType};base64,${fileBuffer.toString("base64")}`;
}

/**
 * Send the API request using native fetch
 */
async function requestVisionApi(payload) {
  const endpoint = new URL("chat/completions", BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`API error [${response.status}]: ${rawText.slice(0, 300)}`);
  }

  try {
    const json = JSON.parse(rawText);
    return json?.choices?.[0]?.message?.content || rawText;
  } catch {
    return rawText;
  }
}

/**
 * Main entry point
 */
async function main() {
  // Check API key
  if (!API_KEY || API_KEY === "sk-xxx") {
    console.error("Error: no valid DASHSCOPE_API_KEY configured.");
    console.error("Set the DASHSCOPE_API_KEY environment variable or configure it in a .env file.");
    console.error("Get a key at: https://bailian.console.aliyun.com/");
    process.exit(1);
  }

  const { imageSource, prompt, isUrl } = parseArgs();

  if (!imageSource) {
    console.error("Usage:");
    console.error("  node vision.js <image path> [question]");
    console.error("  node vision.js --url <image url> [question]");
    process.exit(1);
  }

  try {
    const imageUrl = resolveImageUrl(imageSource, isUrl);
    const result = await requestVisionApi({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } },
            { type: "text", text: prompt },
          ],
        },
      ],
      stream: false,
      max_tokens: 1024,
    });

    console.log(result);
  } catch (err) {
    console.error("Vision failed:", err.message);
    process.exit(1);
  }
}

main();

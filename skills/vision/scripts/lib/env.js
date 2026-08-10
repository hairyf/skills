/**
 * Environment and .env loading for the vision scripts.
 * Loads .env from the current working directory and scripts/.env (never
 * overriding already-set environment variables), then exposes the resolved
 * configuration used by the API layer.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
loadEnvFile(path.resolve(__dirname, "..", ".env"));

export const config = Object.freeze({
  baseUrl:
    process.env.DASHSCOPE_BASE_URL ||
    "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: process.env.DASHSCOPE_API_KEY || "",
  model: process.env.VISION_MODEL || "qwen-vl-max",
});

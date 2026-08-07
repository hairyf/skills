import { loadEnv } from "./env.js";

loadEnv();

// Provider endpoints & keys
export const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const SILICONFLOW_BASE_URL = process.env.SILICONFLOW_BASE_URL || "https://api.siliconflow.cn/v1";
export const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY || "";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const RELAY_BASE_URL = process.env.RELAY_BASE_URL || "";
export const RELAY_API_KEY = process.env.RELAY_API_KEY || "";

// Optional HTTP proxy (e.g. "http://127.0.0.1:7890"). Required to reach
// blocked relays such as api.ofox.ai from some networks (e.g. in China).
export const PROXY_URL =
  process.env.HTTPS_PROXY ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.http_proxy ||
  "";

// Default models per provider (image priority order: GPT Image 2 > Nano Banana > Qwen-Image > GPT Image)
export const DEFAULT_MODELS = {
  openai: "gpt-image-2",
  siliconflow: "Qwen/Qwen-Image",
  gemini: "gemini-2.5-flash-image",
  relay: "google/gemini-2.5-flash-image",
};

// Common image extensions -> MIME type map
export const MIME_MAP = Object.freeze({
  jpg: "jpeg",
  jpeg: "jpeg",
  png: "png",
  gif: "gif",
  webp: "webp",
  bmp: "bmp",
});

export const EXT_BY_FORMAT = Object.freeze({
  png: "png",
  webp: "webp",
  jpeg: "jpg",
  jpg: "jpg",
});

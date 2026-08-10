#!/usr/bin/env node
/**
 * Standalone vision script — calls a Qwen VL model (ESM, zero-dependency)
 *
 * Usage:
 *   node vision.js <image path> [question] [flags]
 *   node vision.js --url <image url> [question] [flags]
 *
 * Flags:
 *   --coords        Force the "## Coordinates" section (element bounding boxes)
 *   --no-coords     Suppress coordinates even when debug intent is detected
 *   --brief         (default) Compact, information-dense output
 *   --detail        Allow fuller detail (raises the token cap to 1600)
 *   --max-tokens N  Cap output size (default 1000)
 *
 * Output contract:
 *   Concise by default: 1 subject line + compact bullets covering every key
 *   element (no fixed cap; group similar elements), visible text verbatim.
 *   Debug-related prompts automatically add a "## Coordinates" section with one
 *   JSON line per element: {"name","text","bbox":[x,y,w,h]} (percentages, origin top-left).
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

// The reply is injected into the caller's context — keep it compact and lossless.
const SYSTEM_BRIEF = `You are a vision assistant embedded in an AI coding agent. Your reply is injected directly into the agent's context, so be precise, concise, and information-dense. Follow the requested output format exactly.
Default format:
- Line 1: what the image is (type/subject) in a few words.
- Bullets: one short bullet per key element, covering all visible text (verbatim) and spatial/layout hints. No fixed cap — completeness matters, so do not omit important elements. When several similar elements share a pattern (menu, list, grid, repeated buttons), group them into one bullet with their labels. Omit only trivial details that add no information.
Never include greetings, filler, explanations, or disclaimers. Do not invent details that are not visible in the image. If the request explicitly asks for more detail, comply.`;

const SYSTEM_DETAIL = `You are a vision assistant embedded in an AI coding agent. Reply in a structured, information-dense way: a 1-2 sentence subject summary, then a compact list of key elements with visible text (verbatim), layout, and notable details. No greetings, filler, or disclaimers. Do not invent details that are not visible in the image.`;

const COORD_INSTRUCTION = `
Additionally, append a section titled "## Coordinates" listing every key visible element (buttons, inputs, icons, text blocks, regions) as one JSON object per line:
{"name": "<short element name>", "text": "<visible text or empty string>", "bbox": {"x": 0, "y": 0, "w": 0, "h": 0}}
- bbox values are percentages of the image (0-100), origin at the top-left, rounded to integers.
- Keep the section compact; do not repeat in prose what the coordinates already describe.`;

// Debug / inspection intent that benefits from element coordinates (heuristic, overridable).
const COORD_KEYWORDS = [
  "debug", "调试", "inspect", "检查", "定位", "element", "元素", "selector",
  "xpath", "dom", "bbox", "bounding box", "coordinate", "坐标", "click", "点击",
  "tap", "button", "按钮", "position", "位置", "layout", "布局", "ui", "界面",
];

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = {
    imageSource: "",
    isUrl: false,
    coords: null, // null = auto-detect, true/false = forced
    verbosity: "brief", // "brief" | "detail"
    maxTokens: 1000,
    maxTokensExplicit: false,
    promptParts: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--url" && argv[i + 1]) {
      opts.isUrl = true;
      opts.imageSource = argv[++i];
    } else if (arg === "--coords") {
      opts.coords = true;
    } else if (arg === "--no-coords") {
      opts.coords = false;
    } else if (arg === "--brief") {
      opts.verbosity = "brief";
    } else if (arg === "--detail") {
      opts.verbosity = "detail";
      if (!opts.maxTokensExplicit) opts.maxTokens = 1600;
    } else if (arg === "--max-tokens" && argv[i + 1] && /^\d+$/.test(argv[i + 1])) {
      opts.maxTokens = parseInt(argv[i + 1], 10);
      opts.maxTokensExplicit = true;
      i++;
    } else if (arg.startsWith("--")) {
      // Ignore unknown flags
    } else if (!opts.imageSource) {
      opts.imageSource = arg;
    } else {
      opts.promptParts.push(arg);
    }
  }

  return opts;
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
 * Decide whether to include element coordinates.
 */
function useCoordinates(prompt, coords) {
  if (coords !== null) return coords;
  const lower = prompt.toLowerCase();
  return COORD_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Build the API payload. Instructions are embedded in the user text part so
 * strict OpenAI-compatible endpoints that only accept user messages still work.
 */
function buildPayload(imageUrl, prompt, { coords, verbosity, maxTokens }) {
  const system = verbosity === "detail" ? SYSTEM_DETAIL : SYSTEM_BRIEF;
  const instruction = coords ? `${system}\n${COORD_INSTRUCTION}` : system;
  return {
    model: MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: imageUrl } },
          { type: "text", text: `${instruction}\n\nTask: ${prompt}` },
        ],
      },
    ],
    stream: false,
    max_tokens: maxTokens,
  };
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

  const opts = parseArgs();

  if (!opts.imageSource) {
    console.error("Usage:");
    console.error("  node vision.js <image path> [question] [--coords|--no-coords] [--brief|--detail] [--max-tokens N]");
    console.error("  node vision.js --url <image url> [question]");
    process.exit(1);
  }

  try {
    const imageUrl = resolveImageUrl(opts.imageSource, opts.isUrl);
    const prompt = opts.promptParts.join(" ") || "Describe this image concisely.";
    const coords = useCoordinates(prompt, opts.coords);
    const result = await requestVisionApi(buildPayload(imageUrl, prompt, { ...opts, coords }));

    console.log(result);
  } catch (err) {
    console.error("Vision failed:", err.message);
    process.exit(1);
  }
}

main();

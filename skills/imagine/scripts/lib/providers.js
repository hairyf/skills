import fs from "node:fs";
import path from "node:path";

import {
  GEMINI_API_KEY,
  MIME_MAP,
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
  RELAY_API_KEY,
  RELAY_BASE_URL,
  SILICONFLOW_API_KEY,
  SILICONFLOW_BASE_URL,
} from "./config.js";
import { buildMultipart, postJson, request } from "./http.js";

/**
 * Resolve a local file into a base64 data URL.
 */
export function toDataUrl(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`);
  }
  const ext = path.extname(resolvedPath).toLowerCase().replace(".", "");
  const mimeType = MIME_MAP[ext] || "jpeg";
  const fileBuffer = fs.readFileSync(resolvedPath);
  return `data:image/${mimeType};base64,${fileBuffer.toString("base64")}`;
}

/**
 * Infer provider from the model name; explicit --provider wins.
 */
export function resolveProvider(opts) {
  if (opts.provider) return opts.provider;
  if (opts.model.startsWith("gemini-")) {
    // Native Gemini requires GEMINI_API_KEY; otherwise use a relay when configured.
    if (GEMINI_API_KEY) return "gemini";
    if (RELAY_BASE_URL && RELAY_API_KEY) return "relay";
    if (OPENAI_API_KEY) return "openai";
    return "gemini";
  }
  if (
    opts.model.includes("Qwen/") ||
    opts.model.includes("Kolors") ||
    opts.model.includes("Z-Image") ||
    opts.model.includes("FLUX") ||
    opts.model.includes("Kwai")
  ) {
    return "siliconflow";
  }
  // Relay-style prefixed models (e.g. google/gemini-2.5-flash-image, openai/gpt-image-2)
  if (opts.model.includes("/") && RELAY_BASE_URL && RELAY_API_KEY) return "relay";
  return "openai";
}

/**
 * OpenAI-compatible provider — /images/generations (create) or /images/edits (edit).
 * Used by the OpenAI provider and by Nano Banana relays (`--provider relay`).
 */
export async function openaiCompatibleGenerate(opts, model, baseUrl, apiKey) {
  const base = baseUrl.replace(/\/+$/, "");

  if (opts.edit) {
    const fields = { model, prompt };
    if (opts.size) fields.size = opts.size;
    if (opts.quality) fields.quality = opts.quality;
    if (opts.background) fields.background = opts.background;
    if (opts.format) fields.output_format = opts.format;
    if (opts.numImages > 1) fields.n = String(opts.numImages);

    const imageExt = path.extname(opts.edit).toLowerCase().replace(".", "");
    const files = {
      image: {
        filename: path.basename(opts.edit),
        data: fs.readFileSync(path.resolve(opts.edit)),
        type: `image/${MIME_MAP[imageExt] || "png"}`,
      },
    };
    if (opts.mask) {
      const maskExt = path.extname(opts.mask).toLowerCase().replace(".", "");
      files.mask = {
        filename: path.basename(opts.mask),
        data: fs.readFileSync(path.resolve(opts.mask)),
        type: `image/${MIME_MAP[maskExt] || "png"}`,
      };
    }

    const { body, contentType } = buildMultipart(fields, files);
    const res = await request(`${base}/images/edits`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": contentType },
      body,
    });
    const rawText = res.buffer.toString("utf-8");
    if (!res.ok) {
      throw new Error(`API error [${res.status}]: ${rawText.slice(0, 300)}`);
    }
    return JSON.parse(rawText);
  }

  const body = { model, prompt: opts.prompt };
  if (opts.size) body.size = opts.size;
  if (opts.quality) body.quality = opts.quality;
  if (opts.background) body.background = opts.background;
  if (opts.format) body.output_format = opts.format;
  if (opts.numImages > 1) body.n = opts.numImages;

  return postJson(`${base}/images/generations`, {
    Authorization: `Bearer ${apiKey}`,
  }, body);
}

/**
 * OpenAI provider.
 */
export async function openaiGenerate(opts, model) {
  return openaiCompatibleGenerate(opts, model, OPENAI_BASE_URL, OPENAI_API_KEY);
}

/**
 * Nano Banana relay provider (OpenAI-compatible base URL).
 */
export async function relayGenerate(opts, model) {
  return openaiCompatibleGenerate(opts, model, RELAY_BASE_URL, RELAY_API_KEY);
}

/**
 * SiliconFlow provider — OpenAI-compatible /images/generations.
 */
export async function siliconflowGenerate(opts, model) {
  const base = SILICONFLOW_BASE_URL.replace(/\/+$/, "");
  const body = {
    model,
    prompt: opts.prompt,
    image_size: opts.size || "1024x1024",
    num_inference_steps: opts.steps || 20,
  };
  if (model.includes("Kolors")) body.batch_size = opts.numImages;
  if (opts.seed) body.seed = Number(opts.seed);
  if (opts.edit) body.image = toDataUrl(opts.edit);

  return postJson(`${base}/images/generations`, {
    Authorization: `Bearer ${SILICONFLOW_API_KEY}`,
  }, body);
}

/**
 * Gemini / Nano Banana provider — native :generateContent endpoint.
 */
export async function geminiGenerate(opts, model) {
  const parts = [];
  if (opts.edit) {
    const resolvedPath = path.resolve(opts.edit);
    const ext = path.extname(resolvedPath).toLowerCase().replace(".", "");
    const mimeType = MIME_MAP[ext] || "jpeg";
    parts.push({
      inline_data: {
        mime_type: `image/${mimeType}`,
        data: fs.readFileSync(resolvedPath).toString("base64"),
      },
    });
  }
  parts.push({ text: opts.prompt });

  const generationConfig = { response_modalities: ["IMAGE"] };
  if (opts.aspect) generationConfig.imageConfig = { aspectRatio: opts.aspect };
  if (opts.seed) generationConfig.seed = Number(opts.seed);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  return postJson(url, {}, {
    contents: [{ parts }],
    generationConfig,
  });
}

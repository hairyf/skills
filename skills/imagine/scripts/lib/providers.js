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
import { latestImage } from "./session.js";

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

  // Session continuity reuses the latest generated image as the edit input.
  const editImage = opts.edit || latestImage(opts.sessionHistory);

  if (editImage) {
    const fields = { model, prompt: opts.prompt };
    if (opts.size) fields.size = opts.size;
    if (opts.quality) fields.quality = opts.quality;
    if (opts.background) fields.background = opts.background;
    if (opts.format) fields.output_format = opts.format;
    if (opts.numImages > 1) fields.n = String(opts.numImages);

    const imageExt = path.extname(editImage).toLowerCase().replace(".", "");
    const files = {
      image: {
        filename: path.basename(editImage),
        data: fs.readFileSync(path.resolve(editImage)),
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

  // Session continuity reuses the latest generated image as the edit input.
  const editImage = opts.edit || latestImage(opts.sessionHistory);
  if (editImage) body.image = toDataUrl(editImage);

  return postJson(`${base}/images/generations`, {
    Authorization: `Bearer ${SILICONFLOW_API_KEY}`,
  }, body);
}

/**
 * Gemini / Nano Banana provider — native :generateContent endpoint.
 */
export async function geminiGenerate(opts, model) {
  const contents = [];

  // Session continuity: replay prior turns as a native Gemini conversation,
  // then append the current user turn with the new prompt.
  if (opts.sessionHistory?.turns?.length) {
    for (const turn of opts.sessionHistory.turns) {
      const parts = [];
      for (const img of turn.images || []) {
        const resolvedPath = path.resolve(img);
        if (!fs.existsSync(resolvedPath)) continue;
        const ext = path.extname(resolvedPath).toLowerCase().replace(".", "");
        const mimeType = MIME_MAP[ext] || "png";
        parts.push({
          inline_data: {
            mime_type: `image/${mimeType}`,
            data: fs.readFileSync(resolvedPath).toString("base64"),
          },
        });
      }
      if (turn.text) parts.push({ text: turn.text });
      if (!parts.length) parts.push({ text: "Generated image" });
      contents.push({ role: turn.role === "model" ? "model" : "user", parts });
    }
  }

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
  contents.push({ role: "user", parts });

  const generationConfig = { response_modalities: ["IMAGE"] };
  if (opts.aspect) generationConfig.imageConfig = { aspectRatio: opts.aspect };
  if (opts.seed) generationConfig.seed = Number(opts.seed);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  return postJson(url, {}, {
    contents,
    generationConfig,
  });
}

/**
 * OpenAI-compatible vision API: payload construction and request handling.
 */

import { config } from "./env.js";
import {
  SYSTEM_BRIEF,
  SYSTEM_DETAIL,
  coordInstruction,
  proposeInstruction,
  verifyInstruction,
} from "./prompts.js";

/**
 * Build the API payload. Instructions are embedded in the user text part so
 * strict OpenAI-compatible endpoints that only accept user messages still work.
 */
export function buildPayload(imageUrl, prompt, { contract, format, detail, maxTokens, size }) {
  const system = detail ? SYSTEM_DETAIL : SYSTEM_BRIEF;
  let instruction = system;
  if (contract === "locate") instruction += `\n${coordInstruction(size, format)}`;
  else if (contract === "propose") instruction += `\n${proposeInstruction(size)}`;
  else if (contract === "verify") instruction += `\n${verifyInstruction(size)}`;
  return {
    model: config.model,
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
export async function requestVisionApi(payload) {
  const endpoint = new URL(
    "chat/completions",
    config.baseUrl.endsWith("/") ? config.baseUrl : `${config.baseUrl}/`,
  );

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
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

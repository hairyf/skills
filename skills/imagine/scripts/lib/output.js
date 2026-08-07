import path from "node:path";

import { EXT_BY_FORMAT, GEMINI_API_KEY, MIME_MAP } from "./config.js";
import { fetchBuffer } from "./http.js";

/**
 * Extract image bytes + suggested extension from a provider response.
 */
export async function extractImages(result, provider) {
  const images = [];

  if (provider === "gemini") {
    for (const candidate of result.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData?.data) {
          images.push({
            buffer: Buffer.from(part.inlineData.data, "base64"),
            ext: MIME_MAP[(part.inlineData.mimeType || "image/png").split("/")[1]] || "png",
          });
        } else if (part.fileData?.fileUri) {
          const fileUrl = part.fileData.fileUri;
          const headers = fileUrl.includes("generativelanguage.googleapis.com")
            ? { "x-goog-api-key": GEMINI_API_KEY }
            : {};
          images.push({
            buffer: await fetchBuffer(fileUrl, headers),
            ext: MIME_MAP[(part.fileData.mimeType || "image/png").split("/")[1]] || "png",
          });
        }
      }
    }
  } else {
    // OpenAI: data[].b64_json | data[].url   /   SiliconFlow: images[].url
    const items = Array.isArray(result.data) ? result.data : result.images || [];
    for (const item of items) {
      if (item?.b64_json) {
        images.push({ buffer: Buffer.from(item.b64_json, "base64"), ext: "png" });
      } else if (item?.url) {
        const url = item.url;
        const extGuess = (path.extname(new URL(url).pathname) || ".png").replace(".", "").toLowerCase();
        images.push({
          buffer: await fetchBuffer(url),
          ext: MIME_MAP[extGuess] || extGuess || "png",
        });
      }
    }
  }

  return images;
}

/**
 * Resolve the final output path for one generated image.
 */
export function resolveOutputPath(opts, index, ext) {
  const finalExt = opts.format ? EXT_BY_FORMAT[opts.format] || ext : ext;

  if (!opts.output) {
    return path.resolve(`image-${Date.now()}-${index + 1}.${finalExt}`);
  }

  const output = path.resolve(opts.output);
  const extname = path.extname(output);
  if (extname) {
    return opts.numImages > 1
      ? output.slice(0, -extname.length) + `-${index + 1}` + extname
      : output;
  }

  return path.join(output, `image-${index + 1}.${finalExt}`);
}

/**
 * Image I/O: format sniffing, dimension detection, and base64 data-URL
 * resolution for local files and remote URLs. The caller never supplies
 * width/height — sizes are detected automatically from the bytes.
 */

import fs from "node:fs";
import path from "node:path";

// Common local image extensions -> MIME type map
export const MIME_MAP = Object.freeze({
  jpg: "jpeg",
  jpeg: "jpeg",
  png: "png",
  gif: "gif",
  webp: "webp",
  bmp: "bmp",
});

/**
 * Detect image dimensions from raw bytes (PNG/JPEG/GIF/BMP/WebP).
 * Returns { width, height } or null when the format is unknown.
 */
export function detectImageSize(buf) {
  const u16BE = (o) => buf.readUInt16BE(o);
  const u32BE = (o) => buf.readUInt32BE(o);
  const u16LE = (o) => buf.readUInt16LE(o);
  const u32LE = (o) => buf.readUInt32LE(o);

  if (buf.length >= 24 && buf.toString("ascii", 1, 4) === "PNG")
    return { width: u32BE(16), height: u32BE(20) };
  if (buf.length >= 10 && buf.toString("ascii", 0, 3) === "GIF")
    return { width: u16LE(6), height: u16LE(8) };
  if (buf.length >= 26 && buf.toString("ascii", 0, 2) === "BM")
    return { width: u32LE(18), height: Math.abs(u32LE(22)) };
  if (
    buf.length >= 30 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const fourcc = buf.toString("ascii", 12, 16);
    if (fourcc === "VP8X")
      return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (fourcc === "VP8 ")
      return { width: u16LE(26) & 0x3fff, height: u16LE(28) & 0x3fff };
    if (fourcc === "VP8L" && buf.length >= 25) {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  // JPEG: scan for SOF markers
  let o = 2;
  while (o + 9 < buf.length) {
    if (buf[o] !== 0xff) {
      o++;
      continue;
    }
    const marker = buf[o + 1];
    if (marker === 0xd8 || marker === 0xff) {
      o++;
      continue;
    }
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc)
      return { height: u16BE(o + 5), width: u16BE(o + 7) };
    o += 2 + u16BE(o + 2);
  }
  return null;
}

/**
 * Detect MIME type from raw bytes; falls back to image/jpeg.
 */
export function detectMime(buf) {
  if (buf.toString("ascii", 1, 4) === "PNG") return "image/png";
  if (buf.toString("ascii", 0, 3) === "GIF") return "image/gif";
  if (buf.toString("ascii", 0, 2) === "BM") return "image/bmp";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return "image/webp";
  return "image/jpeg";
}

/**
 * Resolve the image to a base64 data URL and its pixel size.
 * Local files are read from disk; remote URLs are downloaded so dimensions can
 * be detected automatically.
 */
export async function resolveImage(source, isUrl) {
  let buf;
  if (isUrl) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Failed to fetch image [${response.status}]: ${source}`);
    buf = Buffer.from(await response.arrayBuffer());
  } else {
    const resolvedPath = path.resolve(source);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }
    buf = fs.readFileSync(resolvedPath);
  }

  const mime = isUrl
    ? detectMime(buf)
    : MIME_MAP[path.extname(source).toLowerCase().replace(".", "")] || "jpeg";
  return {
    dataUrl: `data:image/${mime};base64,${buf.toString("base64")}`,
    size: detectImageSize(buf),
  };
}

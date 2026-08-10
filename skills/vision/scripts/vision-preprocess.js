#!/usr/bin/env node
/**
 * Decoupled preprocessing for --coords debug mode.
 *
 * Modes:
 *   prepare <image> [--url] [--crop x,y,w,h] [--model M] [--max-pixels N] [--max-long-edge N] [--min-side N] [--out FILE]
 *     Optionally crop to a region, then resample so it fits the model's input
 *     limits (the shorter side is never shrunk below --min-side, default 96,
 *     to avoid tiny flat crops that degrade grounding). Prints JSON:
 *     { "resizedPath", "origW", "origH", "cropX", "cropY", "cropW", "cropH",
 *       "scaledW", "scaledH", "model", "maxPixels", "maxLongEdge" }
 *
 *   remap --crop-w W --crop-h H --scaled-w W --scaled-h H [--crop-x X --crop-y Y]
 *     Read the model output from stdin, normalize its "## Coordinates"
 *     section, and remap every center point back to the ORIGINAL image pixels.
 *
 * Model input limits: the OpenAI-compatible API does not expose a model's max
 * input size, so this script uses a per-model table (from provider docs) with
 * env overrides VISION_MAX_PIXELS / VISION_MAX_LONG_EDGE and a conservative
 * fallback for unknown models.
 *
 * The first run auto-installs the resampling dependency (sharp) via
 * install-deps.js; install-deps.js can also be run manually.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { formatElement, normalizeCoordinates, parseCoordinateLine, scaleElement } from "./lib/coords.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEPS_DIR = path.join(__dirname, ".deps");
const INSTALLER = path.join(__dirname, "install-deps.js");

/**
 * Resolve sharp, auto-installing it (one-time download) when missing.
 */
function ensureSharp() {
  fs.mkdirSync(DEPS_DIR, { recursive: true });
  const pkgPath = path.join(DEPS_DIR, "package.json");
  if (!fs.existsSync(pkgPath)) {
    fs.writeFileSync(pkgPath, JSON.stringify({ name: "vision-deps", private: true }, null, 2));
  }
  const req = createRequire(pkgPath);
  try {
    req.resolve("sharp");
    return req("sharp");
  } catch {
    console.error("Resampling dependency (sharp) not found. Installing automatically...");
    execFileSync(process.execPath, [INSTALLER], { stdio: ["ignore", "pipe", "inherit"] });
    try {
      req.resolve("sharp");
      return req("sharp");
    } catch (err) {
      console.error("Dependency install failed:", err.message);
      console.error("Retry manually: node scripts/install-deps.js");
      process.exit(1);
    }
  }
}

/**
 * Per-model input limits. Values come from provider docs:
 * - DashScope/Qwen default max_pixels (qwen-vl-max family: 1310720, Qwen3-VL: 2621440,
 *   open Qwen2.5-VL: 1003520)
 * - Claude earlier models: 1568px long edge / ~1.15MP; newer models: 2576px / 3.75MP
 * - OpenAI models publish no hard limit; a conservative desktop-use default is used.
 */
const MODEL_LIMITS = {
  "qwen-vl-max": { maxPixels: 1310720 },
  "qwen-vl-max-latest": { maxPixels: 1310720 },
  "qwen-vl-max-0813": { maxPixels: 1310720 },
  "qwen-vl-plus": { maxPixels: 1310720 },
  "qwen-vl-plus-latest": { maxPixels: 1310720 },
  "qwen-vl-plus-0815": { maxPixels: 1310720 },
  "qwen3-vl-plus": { maxPixels: 2621440 },
  "qwen3-vl-flash": { maxPixels: 2621440 },
  "qwen2.5-vl-72b-instruct": { maxPixels: 1003520 },
  "qwen2-vl-72b-instruct": { maxPixels: 1003520 },
  "claude-3-5-sonnet": { maxLongEdge: 1568, maxPixels: 1150000 },
  "claude-3-5-sonnet-20241022": { maxLongEdge: 1568, maxPixels: 1150000 },
  "claude-3-5-haiku": { maxLongEdge: 1568, maxPixels: 1150000 },
  "claude-sonnet-4-6": { maxLongEdge: 2576, maxPixels: 3750000 },
  "claude-opus-4-7": { maxLongEdge: 2576, maxPixels: 3750000 },
  "gpt-4o": { maxLongEdge: 1568, maxPixels: 1150000 },
  "gpt-4o-mini": { maxLongEdge: 1568, maxPixels: 1150000 },
  "gpt-4.1": { maxLongEdge: 1568, maxPixels: 1150000 },
};

const FALLBACK_LIMIT = { maxLongEdge: 1568, maxPixels: 1150000 };

function getLimit(model, flags) {
  const known = MODEL_LIMITS[model] || FALLBACK_LIMIT;
  const maxPixels = Number(flags.maxPixels ?? process.env.VISION_MAX_PIXELS ?? known.maxPixels ?? FALLBACK_LIMIT.maxPixels);
  const maxLongEdge = Number(flags.maxLongEdge ?? process.env.VISION_MAX_LONG_EDGE ?? known.maxLongEdge ?? FALLBACK_LIMIT.maxLongEdge);
  return { maxPixels, maxLongEdge };
}

async function prepare(args) {
  const sharp = ensureSharp();
  const source = args._[0];

  let input;
  if (args.url) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Failed to fetch image [${res.status}]: ${source}`);
    input = Buffer.from(await res.arrayBuffer());
  } else {
    if (!fs.existsSync(source)) throw new Error(`File not found: ${source}`);
    input = source;
  }

  const meta = await sharp(input).metadata();
  const origW = meta.width;
  const origH = meta.height;
  const { maxPixels, maxLongEdge } = getLimit(args.model, args);

  const crop = args.crop ? parseCrop(args.crop, origW, origH) : null;
  const baseW = crop ? crop.w : origW;
  const baseH = crop ? crop.h : origH;

  // Aspect-ratio-preserving scale to fit both the long-edge and pixel limits.
  const scale = Math.min(
    1,
    maxLongEdge / Math.max(baseW, baseH),
    Math.sqrt(maxPixels / (baseW * baseH)),
  );
  let targetW = Math.max(1, Math.round(baseW * scale));
  let targetH = Math.max(1, Math.round(baseH * scale));
  const minSide = Number(args.minSide ?? process.env.VISION_MIN_SIDE ?? 96);
  if (Math.min(targetW, targetH) < minSide) {
    const up = minSide / Math.min(targetW, targetH);
    targetW = Math.max(1, Math.round(targetW * up));
    targetH = Math.max(1, Math.round(targetH * up));
  }
  const out =
    args.out || path.join(os.tmpdir(), `vision-resized-${process.pid}-${Date.now()}.png`);

  let pipeline = sharp(input).rotate();
  if (crop) {
    pipeline = pipeline.extract({ left: crop.x, top: crop.y, width: crop.w, height: crop.h });
  }
  await pipeline
    .resize({
      width: targetW,
      height: targetH,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toFile(out);

  const final = await sharp(out).metadata();
  console.log(
    JSON.stringify({
      resizedPath: out,
      origW,
      origH,
      cropX: crop ? crop.x : 0,
      cropY: crop ? crop.y : 0,
      cropW: baseW,
      cropH: baseH,
      scaledW: final.width,
      scaledH: final.height,
      model: args.model,
      maxPixels,
      maxLongEdge,
    }),
  );
}

function remap(args) {
  const input = fs.readFileSync(0, "utf8");
  const format = args.format === "center" ? "center" : "bbox";
  const normalized = normalizeCoordinates(input, format);
  const lines = normalized.split(/\r?\n/);
  const idx = lines.findIndex((l) => /^##\s*Coordinates/i.test(l.trim()));
  if (idx === -1) {
    process.stdout.write(normalized);
    return;
  }

  const coords = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const el = parseCoordinateLine(line);
    if (!el) continue;
    coords.push(JSON.stringify(formatElement(scaleElement(el, args), format)));
  }
  if (coords.length === 0) {
    process.stdout.write(normalizeCoordinates(input, format));
    return;
  }

  const head = lines.slice(0, idx).join("\n").trimEnd();
  process.stdout.write(`${head}\n\n## Coordinates\n${coords.join("\n")}`);
}

/**
 * Parse "x,y,w,h" (pixels in the original image) and clamp to image bounds.
 */
function parseCrop(spec, imgW, imgH) {
  const parts = String(spec).split(",").map((s) => Number(s.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0)) {
    throw new Error(`Invalid --crop "${spec}", expected x,y,w,h in original image pixels`);
  }
  const x = Math.round(parts[0]);
  const y = Math.round(parts[1]);
  const w = Math.min(Math.round(parts[2]), imgW - x);
  const h = Math.min(Math.round(parts[3]), imgH - y);
  if (w <= 0 || h <= 0) throw new Error(`--crop "${spec}" is outside the image (${imgW}x${imgH})`);
  return { x, y, w, h };
}

function parseArgv(argv) {
  const args = {
    _: [],
    url: false,
    model: "qwen-vl-max",
    maxPixels: null,
    maxLongEdge: null,
    minSide: null,
    out: null,
    format: "bbox",
    crop: null,
    cropX: 0,
    cropY: 0,
    cropW: null,
    cropH: null,
    scaledW: null,
    scaledH: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url") args.url = true;
    else if (a === "--model") args.model = argv[++i];
    else if (a === "--max-pixels") args.maxPixels = Number(argv[++i]);
    else if (a === "--max-long-edge") args.maxLongEdge = Number(argv[++i]);
    else if (a === "--min-side") args.minSide = Number(argv[++i]);
    else if (a === "--format") args.format = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--crop") args.crop = argv[++i];
    else if (a === "--crop-x") args.cropX = Number(argv[++i]);
    else if (a === "--crop-y") args.cropY = Number(argv[++i]);
    else if (a === "--crop-w") args.cropW = Number(argv[++i]);
    else if (a === "--crop-h") args.cropH = Number(argv[++i]);
    else if (a === "--scaled-w") args.scaledW = Number(argv[++i]);
    else if (a === "--scaled-h") args.scaledH = Number(argv[++i]);
    else if (!a.startsWith("--")) args._.push(a);
  }
  return args;
}

async function main() {
  const mode = process.argv[2];
  const args = parseArgv(process.argv.slice(3));

  if (mode === "--help" || mode === "-h") {
    console.log(`Usage: node vision-preprocess.js <prepare|remap> ...

Modes:
  prepare <image> [--url] [--crop x,y,w,h] [--model M] [--max-pixels N]
          [--max-long-edge N] [--min-side N] [--out FILE]
    Crop (optional) and resample a view to the model's input limits, then
    print JSON metadata (resizedPath, original/crop/scaled sizes).

  remap --crop-w W --crop-h H --scaled-w W --scaled-h H [--crop-x X --crop-y Y]
    Read model output from stdin, normalize its "## Coordinates" section, and
    remap coordinates back to ORIGINAL image pixels.

The first run auto-installs the resampling dependency (sharp) via
scripts/install-deps.js.`);
    process.exit(0);
  }

  if (mode === "prepare") {
    if (!args._[0]) {
      console.error("Usage: node vision-preprocess.js prepare <image> [--url] [--crop x,y,w,h] [--model M] [--max-pixels N] [--max-long-edge N] [--out FILE]");
      process.exit(1);
    }
    await prepare(args);
  } else if (mode === "remap") {
    if (!(args.cropW && args.cropH && args.scaledW && args.scaledH)) {
      console.error("Usage: node vision-preprocess.js remap --crop-w W --crop-h H --scaled-w W --scaled-h H [--crop-x X --crop-y Y] < output.txt");
      process.exit(1);
    }
    remap(args);
  } else {
    console.error("Usage: node vision-preprocess.js <prepare|remap> ...");
    process.exit(1);
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((err) => {
    console.error("Preprocess failed:", err.message);
    process.exit(1);
  });
}

export { getLimit, MODEL_LIMITS, FALLBACK_LIMIT };

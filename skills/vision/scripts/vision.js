#!/usr/bin/env node
/**
 * Vision CLI entry — sends an image to an OpenAI-compatible vision model.
 * Logic lives in scripts/lib/*.js; this file only parses args and orchestrates
 * the rounds.
 *
 * Usage:
 *   node vision.js <image path> [question] [flags]
 *   node vision.js --url <image url> [question] [flags]
 *
 * Flags:
 *   --coords [bbox|center]  Debug mode: append a "## Coordinates" section.
 *                           Default format is bbox; "center" emits center
 *                           points. Values are in ORIGINAL image pixels.
 *   --detail [n]            Fuller detail output; optional token cap n
 *                           (default 1600). Without it output stays compact.
 *   --rounds N              1 = single locate, 2 = coarse-to-fine (default),
 *                           3 = + verification round.
 *   -h, --help              Print usage.
 *
 * Output contract:
 *   Concise by default: 1 subject line + compact bullets covering every key
 *   element (no fixed cap; group similar elements), visible text verbatim.
 *   With --coords, localization runs coarse-to-fine: round 1 proposes a point
 *   or a zoom region, round 2 locates in the focused crop, optional round 3
 *   verifies. Views are resampled by lib/preprocess.js and every coordinate
 *   is remapped back to the ORIGINAL image pixels. The first --coords call
 *   auto-installs the resampling dependency (sharp); non-debug calls stay
 *   zero-dependency.
 *
 * Configuration:
 *   Set the API key via DASHSCOPE_API_KEY (env var or scripts/.env).
 *   Overrides: VISION_MODEL, DASHSCOPE_BASE_URL.
 */

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { config } from "./lib/env.js";
import { resolveImage } from "./lib/image.js";
import { buildPayload, requestVisionApi } from "./lib/api.js";
import {
  clampRegion,
  extractCoordinates,
  formatElement,
  parseProposal,
  parseVerify,
  scaleCenter,
  scaleElement,
  scaleRegion,
  windowAround,
} from "./lib/coords.js";

// Re-export shared utilities so external importers keep working.
export { detectImageSize, detectMime, resolveImage } from "./lib/image.js";
export { buildPayload, requestVisionApi } from "./lib/api.js";
export {
  clampRegion,
  extractCoordinates,
  formatElement,
  normalizeCoordinates,
  parseCoordinateLine,
  parseProposal,
  parseVerify,
  scaleCenter,
  scaleElement,
  scaleRegion,
  windowAround,
} from "./lib/coords.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function usage() {
  return `Usage:
  node vision.js <image> [question] [flags]
  node vision.js --url <image-url> [question] [flags]

Flags:
  --coords [bbox|center]  Debug mode: append "## Coordinates" (element boxes
                          by default, center points with "center") in ORIGINAL
                          image pixels.
  --detail [n]            Fuller detail output; token cap n (default 1600).
  --rounds N              1 = single locate, 2 = coarse-to-fine (default),
                          3 = + verification round.
  -h, --help              Show this help.

Examples:
  node vision.js shot.png "Describe this image"
  node vision.js ui.png "find the login button" --coords center`;
}

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = {
    imageSource: "",
    isUrl: false,
    coords: false, // debug mode — enabled only via --coords
    coordFormat: "bbox", // "bbox" | "center"
    detail: false,
    maxTokens: 1000,
    rounds: 2,
    help: false,
    promptParts: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--url" && argv[i + 1]) {
      opts.isUrl = true;
      opts.imageSource = argv[++i];
    } else if (arg === "--coords") {
      opts.coords = true;
      if (argv[i + 1] === "center" || argv[i + 1] === "bbox") {
        opts.coordFormat = argv[++i];
      }
    } else if (arg === "--detail") {
      opts.detail = true;
      if (argv[i + 1] && /^\d+$/.test(argv[i + 1])) {
        opts.maxTokens = parseInt(argv[i + 1], 10);
        i++;
      } else {
        opts.maxTokens = 1600;
      }
    } else if (arg === "--rounds" && argv[i + 1] && /^\d+$/.test(argv[i + 1])) {
      opts.rounds = Math.max(1, Math.min(3, parseInt(argv[i + 1], 10)));
      i++;
    } else if (arg === "--help" || arg === "-h") {
      opts.help = true;
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
 * Run a helper script with Node, passing optional stdin. Returns stdout.
 */
function runNode(script, args, stdin) {
  const res = spawnSync(process.execPath, [script, ...args], {
    input: stdin,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.status !== 0) {
    throw new Error((res.stderr || res.stdout || "").trim() || `${path.basename(script)} failed`);
  }
  return res.stdout;
}

function cleanup(meta) {
  if (meta?.resizedPath) {
    try {
      fs.unlinkSync(meta.resizedPath);
    } catch {
      // Best-effort temp file cleanup
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  const opts = parseArgs();

  if (opts.help) {
    console.log(usage());
    process.exit(0);
  }

  // Check API key
  if (!config.apiKey || config.apiKey === "sk-xxx") {
    console.error("Error: no valid DASHSCOPE_API_KEY configured.");
    console.error("Set the DASHSCOPE_API_KEY environment variable or configure it in a .env file.");
    console.error("Get a key at: https://bailian.console.aliyun.com/");
    process.exit(1);
  }

  if (!opts.imageSource) {
    console.error(usage());
    process.exit(1);
  }

  try {
    const prompt = opts.promptParts.join(" ") || "Describe this image concisely.";

    if (opts.coords) {
      // Debug mode: coarse-to-fine localization.
      // Round 1 proposes a point or a zoom region, round 2 locates precisely
      // in the focused crop, optional round 3 verifies in a small window.
      const preprocess = path.join(__dirname, "lib", "preprocess.js");
      const prepare = async (crop) => {
        const args = ["prepare", opts.imageSource, ...(opts.isUrl ? ["--url"] : []), "--model", config.model];
        if (crop) args.push("--crop", `${crop.x},${crop.y},${crop.w},${crop.h}`);
        return JSON.parse(runNode(preprocess, args));
      };
      const ask = async (meta, contract, extraPrompt = "") => {
        const dataUrl = `data:image/png;base64,${fs.readFileSync(meta.resizedPath).toString("base64")}`;
        return requestVisionApi(
          buildPayload(dataUrl, extraPrompt ? `${prompt}\n${extraPrompt}` : prompt, {
            contract,
            format: opts.coordFormat,
            detail: opts.detail,
            maxTokens: opts.maxTokens,
            size: { width: meta.scaledW, height: meta.scaledH },
          }),
        );
      };

      let cropBox = null;
      if (opts.rounds >= 2) {
        // Round 1: propose a point or a zoom region on the full image
        const meta1 = await prepare(null);
        let proposal = parseProposal(await ask(meta1, "propose"));
        if (!proposal) {
          proposal = parseProposal(await ask(meta1, "propose", 'If unsure, output a "region" to zoom into.'));
        }
        if (!proposal) throw new Error("Model did not propose a target or region; retry with --rounds 1");
        if (proposal.type === "region") {
          cropBox = clampRegion(scaleRegion(proposal.region, meta1), meta1.origW, meta1.origH);
        } else {
          const c1 = scaleCenter(proposal.center, meta1);
          cropBox = windowAround(c1, meta1.origW, meta1.origH, 0.5, 400);
        }
        cleanup(meta1);
      }

      // Round 2: focused locate (full image when --rounds 1)
      const meta2 = await prepare(cropBox);
      const res2 = await ask(meta2, "locate");
      const { head, elements } = extractCoordinates(res2);
      if (elements.length === 0) throw new Error("No coordinates found in the model response");
      const finalElements = elements.map((el) => scaleElement(el, meta2));
      const finalHead = head;

      if (opts.rounds >= 3 && finalElements.length > 0) {
        // Round 3: verify the primary target in a small zoomed window
        const crop3 = windowAround(finalElements[0].center, meta2.origW, meta2.origH, 0.25, 200);
        const meta3 = await prepare(crop3);
        const v = parseVerify(await ask(meta3, "verify"));
        if (v && v.center) {
          const c3 = scaleCenter(v.center, meta3);
          const prev = finalElements[0];
          const next = { name: prev.name, text: prev.text, center: c3 };
          if (prev.bbox) {
            next.bbox = {
              x: Math.round(c3.x - prev.bbox.w / 2),
              y: Math.round(c3.y - prev.bbox.h / 2),
              w: prev.bbox.w,
              h: prev.bbox.h,
            };
          }
          finalElements[0] = next;
        }
        cleanup(meta3);
      }

      const coordsText = finalElements.map((el) => JSON.stringify(formatElement(el, opts.coordFormat))).join("\n");
      console.log(finalHead ? `${finalHead}\n\n## Coordinates\n${coordsText}` : coordsText);
      cleanup(meta2);
    } else {
      const { dataUrl } = await resolveImage(opts.imageSource, opts.isUrl);
      const result = await requestVisionApi(
        buildPayload(dataUrl, prompt, {
          contract: null,
          detail: opts.detail,
          maxTokens: opts.maxTokens,
          size: null,
        }),
      );
      console.log(result);
    }
  } catch (err) {
    console.error("Vision failed:", err.message);
    process.exit(1);
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();

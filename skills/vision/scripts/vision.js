#!/usr/bin/env node
/**
 * Vision CLI entry — sends an image to an OpenAI-compatible vision model.
 * Logic lives in scripts/lib/*.js; this file only parses args and orchestrates
 * the rounds.
 *
 * Usage:
 *   node vision.js <image path> [question] [flags]
 *   node vision.js --url <image url> [question] [flags]
 *   node vision.js --base64 <data|-> [question] [flags]
 *
 * Flags:
 *   --base64 <data|->      Image as raw base64 or data:image/...;base64,... URL;
 *                          "-" reads the payload from stdin.
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
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { config } from "./lib/env.js";
import { detectMime, resolveImage } from "./lib/image.js";
import { buildPayload, requestVisionApi } from "./lib/api.js";
import {
  imageUrlFor,
  isValidSessionName,
  loadSession,
  saveSession,
  trimTurns,
} from "./lib/session.js";
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
export {
  imageUrlFor,
  isValidSessionName,
  loadSession,
  saveSession,
  sessionPath,
  trimTurns,
} from "./lib/session.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function usage() {
  return `Usage:
  node vision.js <image> [question] [flags]
  node vision.js --url <image-url> [question] [flags]
  node vision.js --base64 <base64-or-data-url> [question] [flags]
  node vision.js --base64 - < shot.b64 [question] [flags]

Flags:
  --base64 <data|->        Image as raw base64 or data:image/...;base64,... URL;
                           "-" reads the payload from stdin (for large payloads).
  --coords [bbox|center]  Debug mode: append "## Coordinates" (element boxes
                          by default, center points with "center") in ORIGINAL
                          image pixels.
  --detail [n]            Fuller detail output; token cap n (default 1600).
  --rounds N              1 = single locate, 2 = coarse-to-fine (default),
                          3 = + verification round.
  -S, --session <name>    Session continuity: keep context across calls so later
                          questions can build on earlier images and replies.
                          State is stored in .vision/<name>.json
                          (VISION_SESSION_DIR overrides the directory). Omit to
                          keep the default stateless behavior.
  -h, --help              Show this help.

Examples:
  node vision.js shot.png "Describe this image"
  node vision.js shot.png "Describe this image" -S ui
  node vision.js shot2.png "Compare with the previous image" -S ui
  node vision.js ui.png "find the login button" --coords center
  node vision.js --base64 - "find the login button" --coords center`;
}

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = {
    imageSource: "",
    isUrl: false,
    isBase64: false,
    coords: false, // debug mode — enabled only via --coords
    coordFormat: "bbox", // "bbox" | "center"
    detail: false,
    maxTokens: 1000,
    rounds: 2,
    session: "",
    help: false,
    promptParts: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--url" && argv[i + 1]) {
      opts.isUrl = true;
      opts.imageSource = argv[++i];
    } else if (arg === "--base64") {
      opts.isBase64 = true;
      const next = argv[i + 1];
      opts.imageSource = next && !next.startsWith("--") ? argv[++i] : "-";
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
    } else if (arg === "-S" || arg === "--session") {
      opts.session = argv[++i] || "";
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

const DATA_URL_RE = /^data:image\/[a-z0-9.+-]+;base64,/i;

/**
 * Read the full stdin as a UTF-8 string (for `--base64 -`).
 */
function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

/**
 * Decode a raw base64 string or data:image/...;base64,... URL into a temp
 * image file so the rest of the pipeline can treat it as a local file.
 * Returns the temp path and the data URL (used as the session image source).
 */
function materializeBase64(payload) {
  let b64 = String(payload).trim();
  const prefix = DATA_URL_RE.exec(b64);
  if (prefix) b64 = b64.slice(prefix[0].length);
  b64 = b64.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (!b64) {
    throw new Error("Empty base64 input (pass data with --base64 <data>, or '-' for stdin)");
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(b64)) {
    throw new Error("Invalid base64 input; expected raw base64 or a data:image/...;base64,... URL");
  }
  const buf = Buffer.from(b64, "base64");
  if (buf.length === 0) throw new Error("Base64 input decoded to an empty image");
  const mime = detectMime(buf);
  const ext = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/bmp": "bmp",
  }[mime] || "img";
  const tmpPath = path.join(os.tmpdir(), `vision-base64-${process.pid}-${Date.now()}.${ext}`);
  fs.writeFileSync(tmpPath, buf);
  return { tmpPath, dataUrl: `data:${mime};base64,${buf.toString("base64")}` };
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

  let base64TempPath = null;
  try {
    let currentSource = "";
    if (opts.isBase64) {
      const payload = opts.imageSource === "-" ? await readStdin() : opts.imageSource;
      const materialized = materializeBase64(payload);
      base64TempPath = materialized.tmpPath;
      currentSource = materialized.dataUrl;
      opts.imageSource = base64TempPath;
      opts.isUrl = false;
    } else if (opts.isUrl) {
      currentSource = opts.imageSource;
    } else {
      currentSource = path.resolve(opts.imageSource);
    }
    const prompt = opts.promptParts.join(" ") || "Describe this image concisely.";

    // Session continuity — load prior state (or start fresh) and build the
    // replay history. A model switch resets the session with a warning.
    let sessionState = null;
    if (opts.session) {
      if (!isValidSessionName(opts.session)) {
        console.error(
          `Error: invalid session name "${opts.session}" — use letters, digits, "-" or "_".`,
        );
        process.exit(1);
      }
      sessionState = loadSession(opts.session);
      if (sessionState && sessionState.model !== config.model) {
        console.error(
          `提示: 会话 "${opts.session}" 属于模型 ${sessionState.model}，本次是 ${config.model}，已重新开始会话。`,
        );
        sessionState = null;
      }
      if (sessionState) {
        const history = [];
        for (const turn of trimTurns(sessionState.turns || [])) {
          const images = (turn.images || []).map(imageUrlFor).filter(Boolean);
          history.push({ role: turn.role, text: turn.text || "", images });
        }
        opts.sessionHistory = history;
      }
    }

    let output = "";
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
            history: opts.sessionHistory,
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
      output = finalHead ? `${finalHead}\n\n## Coordinates\n${coordsText}` : coordsText;
      console.log(output);
      cleanup(meta2);
    } else {
      const { dataUrl } = await resolveImage(opts.imageSource, opts.isUrl);
      const result = await requestVisionApi(
        buildPayload(dataUrl, prompt, {
          contract: null,
          detail: opts.detail,
          maxTokens: opts.maxTokens,
          size: null,
          history: opts.sessionHistory,
        }),
      );
      output = result;
      console.log(output);
    }

    if (opts.session) {
      const state = sessionState || { model: config.model, turns: [] };
      state.turns.push({
        role: "user",
        text: prompt,
        images: currentSource ? [currentSource] : [],
      });
      state.turns.push({ role: "assistant", text: output, images: [] });
      const sessionFile = saveSession(opts.session, state);
      console.error(`会话 "${opts.session}" 已更新: ${sessionFile}`);
    }
  } catch (err) {
    console.error("Vision failed:", err.message);
    process.exitCode = 1;
  } finally {
    if (base64TempPath) {
      try {
        fs.unlinkSync(base64TempPath);
      } catch {
        // Best-effort temp file cleanup
      }
    }
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();

#!/usr/bin/env node
/**
 * Standalone image generation script (ESM, zero-dependency)
 *
 * Generates images, stickers and seamless textures through multiple providers:
 *   - OpenAI (gpt-image-2, gpt-image-1.5, gpt-image-1)
 *   - SiliconFlow (Qwen/Qwen-Image, Qwen/Qwen-Image-Edit-2509, Tongyi-MAI/Z-Image-Turbo)
 *   - Gemini / Nano Banana (gemini-2.5-flash-image, gemini-3.1-flash-image, gemini-3-pro-image)
 *   - Nano Banana relays (google/gemini-2.5-flash-image via RELAY_BASE_URL, e.g. Ofox)
 *
 * Usage:
 *   node imagine.js "a cute cat sticker, die-cut, white border" -o cat.png
 *   node imagine.js "..." -m google/gemini-2.5-flash-image -o dog.png
 *   node imagine.js "..." -m gemini-2.5-flash-image --provider gemini --aspect 16:9
 *   node imagine.js "..." -m Qwen/Qwen-Image --provider siliconflow -s 1328x1328
 *   node imagine.js "add a red balloon" -e photo.png -o edited.png
 *
 * Configuration (env vars or .env in cwd / script dir, see lib/config.js):
 *   OPENAI_API_KEY / SILICONFLOW_API_KEY / GEMINI_API_KEY
 *   RELAY_API_KEY + RELAY_BASE_URL (Nano Banana relay, e.g. Ofox)
 *   HTTPS_PROXY (optional CONNECT proxy for blocked relay domains)
 */

import fs from "node:fs";
import path from "node:path";

import {
  DEFAULT_MODELS,
  GEMINI_API_KEY,
  OPENAI_API_KEY,
  RELAY_API_KEY,
  RELAY_BASE_URL,
  SILICONFLOW_API_KEY,
} from "./lib/config.js";
import {
  geminiGenerate,
  openaiGenerate,
  relayGenerate,
  resolveProvider,
  siliconflowGenerate,
} from "./lib/providers.js";
import { extractImages, resolveOutputPath } from "./lib/output.js";
import { clearSession, loadSession, saveSession } from "./lib/session.js";

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = {
    prompt: "",
    output: "",
    model: "",
    provider: "",
    size: "",
    quality: "",
    background: "",
    format: "",
    edit: "",
    mask: "",
    numImages: 1,
    seed: "",
    steps: 0,
    aspect: "",
    session: "",
    sessionReset: false,
    help: false,
  };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "-o":
      case "--output":
        opts.output = argv[++i] || "";
        break;
      case "-m":
      case "--model":
        opts.model = argv[++i] || "";
        break;
      case "--provider":
        opts.provider = argv[++i] || "";
        break;
      case "-s":
      case "--size":
        opts.size = argv[++i] || "";
        break;
      case "-q":
      case "--quality":
        opts.quality = argv[++i] || "";
        break;
      case "--background":
        opts.background = argv[++i] || "";
        break;
      case "-f":
      case "--format":
        opts.format = argv[++i] || "";
        break;
      case "-e":
      case "--edit":
        opts.edit = argv[++i] || "";
        break;
      case "--mask":
        opts.mask = argv[++i] || "";
        break;
      case "-n":
      case "--num-images":
        opts.numImages = parseInt(argv[++i], 10) || 1;
        break;
      case "--seed":
        opts.seed = argv[++i] || "";
        break;
      case "--steps":
        opts.steps = parseInt(argv[++i], 10) || 0;
        break;
      case "--aspect":
        opts.aspect = argv[++i] || "";
        break;
      case "-S":
      case "--session":
        opts.session = argv[++i] || "";
        break;
      case "--session-reset":
        opts.sessionReset = true;
        break;
      case "-h":
      case "--help":
        opts.help = true;
        break;
      default:
        if (arg.startsWith("-")) {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
        positional.push(arg);
    }
  }

  opts.prompt = positional.join(" ");
  return opts;
}

function printHelp() {
  console.log(`Usage:
  node imagine.js "<prompt>" [options]
  node imagine.js "<prompt>" -e <image> [options]   (edit an image)

Options:
  -o, --output <path>    Output file or directory (default: image-<timestamp>.<ext>)
  -m, --model <id>       Model id (default: gpt-image-2, Qwen/Qwen-Image, gemini-2.5-flash-image)
      --provider <name>  Force provider: openai | siliconflow | gemini | relay
  -s, --size <WxH>       Image size, e.g. 1024x1024 / 1536x1024 / 1328x1328
  -q, --quality <lvl>    low | medium | high (OpenAI)
      --background <bg>  auto | transparent | opaque (OpenAI; transparent needs png/webp)
  -f, --format <fmt>     png | jpeg | webp
  -e, --edit <image>     Edit an existing image
      --mask <image>     Mask for inpainting (OpenAI edits)
  -n, --num-images <n>   Number of images (OpenAI/SiliconFlow)
      --seed <n>         Seed for reproducible output
      --steps <n>        Inference steps (SiliconFlow, default 20)
      --aspect <ratio>   Aspect ratio for Gemini: 1:1, 16:9, 9:16, 4:3, 3:4
  -S, --session <name>  Conversation continuity: reuse the previous generation in
                        this session as the edit input / conversation context.
                        State is stored in .imagine-sessions/<name>.json
                        (IMAGINE_SESSION_DIR overrides the directory). Omit to keep
                        the default stateless behavior.
      --session-reset   Clear the session state before this run
  -h, --help             Show this help

Env vars (or .env next to the script / in cwd):
  OPENAI_API_KEY, SILICONFLOW_API_KEY, GEMINI_API_KEY
  OPENAI_BASE_URL, SILICONFLOW_BASE_URL (optional overrides)
  RELAY_API_KEY + RELAY_BASE_URL (Nano Banana relay, OpenAI-compatible)`);
}

/**
 * Main entry point
 */
async function main() {
  const opts = parseArgs();

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  if (!opts.prompt) {
    console.error("Error: missing prompt.");
    printHelp();
    process.exit(1);
  }

  const provider = resolveProvider(opts);
  const model = opts.model || DEFAULT_MODELS[provider] || "gpt-image-2";

  let apiKey;
  let needsBaseUrl = false;
  if (provider === "openai") apiKey = OPENAI_API_KEY;
  else if (provider === "siliconflow") apiKey = SILICONFLOW_API_KEY;
  else if (provider === "relay") {
    apiKey = RELAY_API_KEY;
    needsBaseUrl = true;
  } else apiKey = GEMINI_API_KEY;

  if (!apiKey || apiKey === "sk-xxx" || apiKey === "your-api-key") {
    const keyName =
      provider === "openai"
        ? "OPENAI_API_KEY"
        : provider === "siliconflow"
          ? "SILICONFLOW_API_KEY"
          : provider === "relay"
            ? "RELAY_API_KEY"
            : "GEMINI_API_KEY";
    console.error(`Error: no valid ${keyName} configured for provider "${provider}".`);
    console.error(`Set the ${keyName} environment variable or configure it in a .env file.`);
    process.exit(1);
  }
  if (needsBaseUrl && !RELAY_BASE_URL) {
    console.error('Error: RELAY_BASE_URL not configured for provider "relay".');
    console.error("Set RELAY_BASE_URL (e.g. https://gateway.theturbo.ai/v1) in a .env file.");
    process.exit(1);
  }

  // Session continuity — load prior state (or start fresh) and attach it to opts.
  let sessionState = null;
  if (opts.session) {
    if (opts.sessionReset) {
      clearSession(opts.session);
      console.error(`提示: 已重置会话 "${opts.session}"。`);
    }
    sessionState = loadSession(opts.session);
    if (sessionState && (sessionState.provider !== provider || sessionState.model !== model)) {
      console.error(
        `提示: 会话 "${opts.session}" 属于 ${sessionState.provider}/${sessionState.model}，本次是 ${provider}/${model}，已重新开始会话。`,
      );
      sessionState = null;
    }
    if (sessionState) opts.sessionHistory = sessionState;
  }

  try {
    let result;
    if (provider === "gemini") {
      result = await geminiGenerate(opts, model);
    } else if (provider === "siliconflow") {
      result = await siliconflowGenerate(opts, model);
    } else if (provider === "relay") {
      result = await relayGenerate(opts, model);
    } else {
      result = await openaiGenerate(opts, model);
    }

    const images = await extractImages(result, provider);
    if (!images.length) {
      throw new Error("No image returned in the API response.");
    }

    const saved = [];
    for (let i = 0; i < images.length; i++) {
      const outputPath = resolveOutputPath(opts, i, images[i].ext);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, images[i].buffer);
      saved.push(outputPath);
    }

    for (const file of saved) console.log(file);

    if (opts.session) {
      const state = sessionState || { provider, model, turns: [] };
      state.turns.push({ role: "user", text: opts.prompt, images: [] });
      state.turns.push({ role: "model", text: "", images: saved });
      const sessionFile = saveSession(opts.session, state);
      console.error(`会话 "${opts.session}" 已更新: ${sessionFile}`);
    }
  } catch (err) {
    console.error("Image generation failed:", err.message);
    process.exit(1);
  }
}

main();

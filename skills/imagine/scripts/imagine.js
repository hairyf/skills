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
import { convertToOgg, hasFfmpeg, printFfmpegHint, resizeImage } from "./lib/ffmpeg.js";

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = {
    command: "",
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
    sampleRate: 0,
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
      case "--sample-rate":
        opts.sampleRate = parseInt(argv[++i], 10) || 0;
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

  opts.command = positional[0] || "";
  opts.prompt = (opts.command === "ogg" ? positional.slice(1) : positional).join(" ");
  return opts;
}

function printHelp() {
  console.log(`Usage:
  node imagine.js "<prompt>" [options]
  node imagine.js "<prompt>" -e <image> [options]   (edit an image)
  node imagine.js ogg <audio.mp3|wav|flac> -o out.ogg [--sample-rate 44100]

Options:
  -o, --output <path>    Output file or directory (default: image-<timestamp>.<ext>)
  -m, --model <id>       Model id (default: gpt-image-2, Qwen/Qwen-Image, gemini-2.5-flash-image)
      --provider <name>  Force provider: openai | siliconflow | gemini | relay
  -s, --size <WxH>       Image size, e.g. 1024x1024 / 1536x1024 / 1328x1328
                         Small texture sizes like 16x16 / 32x32 are passed through
                         (OpenAI) or downscaled via ffmpeg (other providers)
  -q, --quality <lvl>    low | medium | high (OpenAI)
      --background <bg>  auto | transparent | opaque (OpenAI; transparent needs png/webp)
  -f, --format <fmt>     png | jpeg | webp
  -e, --edit <image>     Edit an existing image
      --mask <image>     Mask for inpainting (OpenAI edits)
  -n, --num-images <n>   Number of images (OpenAI/SiliconFlow)
      --seed <n>         Seed for reproducible output
      --steps <n>        Inference steps (SiliconFlow, default 20)
      --aspect <ratio>   Aspect ratio for Gemini: 1:1, 16:9, 9:16, 4:3, 3:4
      --sample-rate <hz> Output sample rate for ogg export (default 44100)
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

  if (opts.command === "ogg") {
    const input = opts.prompt;
    if (!input) {
      console.error("错误: 缺少输入音频文件。用法: node imagine.js ogg <input.mp3|wav|flac> -o out.ogg [--sample-rate 44100]");
      process.exit(1);
    }
    const out = opts.output || input.replace(/\.[^.]+$/, "") + ".ogg";
    if (!hasFfmpeg()) {
      printFfmpegHint();
      process.exit(1);
    }
    const code = convertToOgg(input, out, opts.sampleRate || 44100);
    if (code !== 0) {
      console.error(`转换失败（ffmpeg 退出码 ${code}）`);
      process.exit(1);
    }
    console.log(path.resolve(out));
    return;
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
    const sizeMatch = /^(\d+)x(\d+)$/.exec(opts.size || "");
    const smallSize =
      sizeMatch && Number(sizeMatch[1]) <= 64 && Number(sizeMatch[2]) <= 64
        ? { w: Number(sizeMatch[1]), h: Number(sizeMatch[2]) }
        : null;
    let warnedNoFfmpeg = false;
    for (let i = 0; i < images.length; i++) {
      const outputPath = resolveOutputPath(opts, i, images[i].ext);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, images[i].buffer);
      if (smallSize) {
        if (hasFfmpeg()) {
          const tmpPath = outputPath + ".tmp";
          fs.renameSync(outputPath, tmpPath);
          const resizeCode = resizeImage(tmpPath, outputPath, smallSize.w, smallSize.h);
          fs.unlinkSync(tmpPath);
          if (resizeCode !== 0) {
            throw new Error(`缩放图片失败（ffmpeg 退出码 ${resizeCode}）`);
          }
        } else if (!warnedNoFfmpeg) {
          warnedNoFfmpeg = true;
          console.error(
            `提示: 目标尺寸 ${opts.size} 过小，当前输出为 provider 原生尺寸；安装 ffmpeg 后可自动缩放到 ${opts.size}（winget install ffmpeg）。`,
          );
        }
      }
      saved.push(outputPath);
    }

    for (const file of saved) console.log(file);
  } catch (err) {
    console.error("Image generation failed:", err.message);
    process.exit(1);
  }
}

main();

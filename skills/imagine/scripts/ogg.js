#!/usr/bin/env node
/**
 * Generic audio -> .ogg converter (zero-dependency, wraps ffmpeg).
 *
 * Usage:
 *   node ogg.js <input.mp3|wav|flac> -o out.ogg [--sample-rate 44100]
 */

import path from "node:path";

import { convertToOgg, hasFfmpeg, printFfmpegHint } from "./lib/ffmpeg.js";

function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = { input: "", output: "", sampleRate: 44100, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-o" || arg === "--output") opts.output = argv[++i] || "";
    else if (arg === "--sample-rate") opts.sampleRate = parseInt(argv[++i], 10) || 44100;
    else if (arg === "-h" || arg === "--help") opts.help = true;
    else if (!arg.startsWith("-") && !opts.input) opts.input = arg;
  }
  return opts;
}

function main() {
  const { input, output, sampleRate, help } = parseArgs();

  if (help) {
    console.log("用法: node ogg.js <input.mp3|wav|flac> -o out.ogg [--sample-rate 44100]");
    process.exit(0);
  }
  if (!input) {
    console.error("错误: 缺少输入音频文件。");
    console.error("用法: node ogg.js <input.mp3|wav|flac> -o out.ogg [--sample-rate 44100]");
    process.exit(1);
  }

  const out = output || input.replace(/\.[^.]+$/, "") + ".ogg";

  if (!hasFfmpeg()) {
    printFfmpegHint();
    process.exit(1);
  }

  const code = convertToOgg(input, out, sampleRate);
  if (code !== 0) {
    console.error(`转换失败（ffmpeg 退出码 ${code}）`);
    process.exit(1);
  }
  console.log(path.resolve(out));
}

main();

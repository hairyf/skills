import { spawnSync } from "node:child_process";

/**
 * Check whether ffmpeg is available on PATH.
 */
export function hasFfmpeg() {
  const result = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  return result.status === 0;
}

/**
 * Convert an audio file to .ogg (Vorbis), e.g. mp3/wav/flac -> ogg.
 * Generic utility — not tied to any game or platform.
 */
export function convertToOgg(input, output, sampleRate = 44100) {
  const result = spawnSync(
    "ffmpeg",
    ["-y", "-i", input, "-ar", String(sampleRate), "-c:a", "libvorbis", output],
    { stdio: "inherit" },
  );
  return result.status ?? 1;
}

/**
 * Resize an image to an exact pixel size (e.g. 16x16, 32x32) with ffmpeg.
 */
export function resizeImage(input, output, width, height) {
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      input,
      "-vf",
      `scale=${width}:${height}:flags=lanczos`,
      output,
    ],
    { stdio: "inherit" },
  );
  return result.status ?? 1;
}

/**
 * Print install guidance when ffmpeg is missing.
 */
export function printFfmpegHint() {
  console.error("错误: 未找到 ffmpeg，请先安装：");
  console.error("  Windows: winget install ffmpeg  或 https://www.gyan.dev/ffmpeg/builds/");
  console.error("  macOS:   brew install ffmpeg");
  console.error("  Linux:   sudo apt install ffmpeg");
}

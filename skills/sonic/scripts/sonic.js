#!/usr/bin/env node
/**
 * Standalone audio generation script (ESM, zero-dependency)
 *
 * Generates voice (TTS), music, lyrics and sound effects through multiple providers:
 *   - TTS: SiliconFlow (CosyVoice2 / Fish-Speech), MiniMax, OpenAI, ElevenLabs, relays
 *   - Music: MiniMax Music 3.0 (music_generation + lyrics_generation)
 *   - SFX:  Sony Woosh (local FastAPI) / ElevenLabs sound effects
 *
 * Usage:
 *   node sonic.js tts "你好，世界" -o hi.mp3
 *   node sonic.js tts "hello" -m FunAudioLLM/CosyVoice2-0.5B --voice fishaudio/fish-speech-1.5:alex
 *   node sonic.js music "欢快的爵士，铜管与低音提琴" -o song.mp3 --lyrics "..."
 *   node sonic.js lyrics "夏日的海边"
 *   node sonic.js sfx "脚步声踩在雪地上" -o steps.flac
 *
 * Configuration (env vars or .env in cwd / script dir, see lib/config.js):
 *   SILICONFLOW_API_KEY / OPENAI_API_KEY / MINIMAX_API_KEY
 *   ELEVENLABS_API_KEY / RELAY_API_KEY + RELAY_BASE_URL
 *   WOOSH_URL (default http://127.0.0.1:8000) / HTTPS_PROXY
 */

import fs from "node:fs";
import path from "node:path";

import {
  DEFAULT_MUSIC_MODEL,
  DEFAULT_SFX_MODEL,
  DEFAULT_TTS_MODELS,
  ELEVENLABS_API_KEY,
  MINIMAX_API_KEY,
  MMAUDIO_API_KEY,
  MMAUDIO_LOCAL_URL,
  OPENAI_BASE_URL,
  OPENAI_API_KEY,
  RELAY_API_KEY,
  RELAY_BASE_URL,
  SILICONFLOW_BASE_URL,
  SILICONFLOW_API_KEY,
} from "./lib/config.js";
import {
  lyricsMinimax,
  musicMinimax,
  resolveTtsProvider,
  sfxElevenlabs,
  sfxMmaudio,
  sfxMmaudioLocal,
  sfxWoosh,
  ttsElevenlabs,
  ttsMinimax,
  ttsOpenAICompatible,
} from "./lib/providers.js";
import { resolveAudioPath } from "./lib/output.js";

/**
 * Parse CLI arguments. First positional = command, rest = text/prompt.
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = {
    command: "",
    text: "",
    output: "",
    model: "",
    provider: "",
    voice: "",
    format: "",
    speed: "",
    sampleRate: "",
    duration: "",
    promptInfluence: "",
    lyrics: "",
    lyricsFile: "",
    instrumental: false,
    lyricsOptimizer: false,
    cover: "",
    video: "",
    negative: "",
    mode: "",
    steps: 0,
    cfg: "",
    seed: "",
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
      case "-v":
      case "--voice":
        opts.voice = argv[++i] || "";
        break;
      case "-f":
      case "--format":
        opts.format = argv[++i] || "";
        break;
      case "--speed":
        opts.speed = argv[++i] || "";
        break;
      case "--sample-rate":
        opts.sampleRate = argv[++i] || "";
        break;
      case "--duration":
        opts.duration = argv[++i] || "";
        break;
      case "--prompt-influence":
        opts.promptInfluence = argv[++i] || "";
        break;
      case "--lyrics":
        opts.lyrics = argv[++i] || "";
        break;
      case "--lyrics-file":
        opts.lyricsFile = argv[++i] || "";
        break;
      case "--instrumental":
        opts.instrumental = true;
        break;
      case "--lyrics-optimizer":
        opts.lyricsOptimizer = true;
        break;
      case "--cover":
        opts.cover = argv[++i] || "";
        break;
      case "--video":
        opts.video = argv[++i] || "";
        break;
      case "--negative":
        opts.negative = argv[++i] || "";
        break;
      case "--mode":
        opts.mode = argv[++i] || "";
        break;
      case "--steps":
        opts.steps = parseInt(argv[++i], 10) || 0;
        break;
      case "--cfg":
        opts.cfg = argv[++i] || "";
        break;
      case "--seed":
        opts.seed = argv[++i] || "";
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
  opts.text = positional.slice(1).join(" ");
  return opts;
}

function printHelp() {
  console.log(`Usage:
  node sonic.js tts "<text>" -o out.mp3 [options]
  node sonic.js music "<style prompt>" -o out.mp3 [--lyrics "..." | --instrumental]
  node sonic.js lyrics "<topic>"                    (MiniMax lyrics generation)
  node sonic.js sfx "<sound description>" -o out.flac [--provider woosh|mmaudio|mmaudio-local|elevenlabs]

Commands:
  tts       Text-to-speech (voice)
  music     Full song / instrumental (MiniMax Music 3.0)
  lyrics    Generate lyrics for a topic (MiniMax)
  sfx       Sound effects (local Sony Woosh by default, or ElevenLabs)

Options:
  -o, --output <path>     Output file or directory (default: audio-<timestamp>.<ext>)
  -m, --model <id>        Model id (default per provider, see references)
      --provider <name>   tts: siliconflow | openai | minimax | elevenlabs | relay
                          sfx: woosh | mmaudio | mmaudio-local | elevenlabs
  -v, --voice <voice>     Voice id (TTS)
  -f, --format <fmt>      tts: mp3 | wav | opus | pcm ; music: mp3 | wav ; sfx: flac
      --speed <0.25-4>    Speech speed (TTS)
      --sample-rate <hz>  Output sample rate
      --duration <sec>    Sound effect length (ElevenLabs sfx)
      --prompt-influence <0-1>  Prompt adherence (ElevenLabs sfx)
      --video <url>       Video URL for video-to-audio (MMAudio sfx)
      --negative <text>   Negative prompt (MMAudio sfx)
      --lyrics <text>     Song lyrics (music)
      --instrumental      Generate instrumental only (music)
      --lyrics-optimizer  Auto-write lyrics from the prompt (music)
      --cover <url>       Reference audio URL for a cover version (music)
      --steps <n>         Woosh inference steps (default 8)
      --cfg <float>       Woosh guidance (default 1)
      --seed <n>          Seed for reproducibility
  -h, --help              Show this help

Env vars (or .env next to the script / in cwd):
  SILICONFLOW_API_KEY, OPENAI_API_KEY, MINIMAX_API_KEY
  ELEVENLABS_API_KEY, MMAUDIO_API_KEY, RELAY_API_KEY + RELAY_BASE_URL
  WOOSH_URL (default http://127.0.0.1:8000), HTTPS_PROXY`);
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

  const command = opts.command;
  if (!command || !opts.text) {
    console.error("Error: missing command or text. Usage: node sonic.js <tts|music|lyrics|sfx> \"...\"");
    printHelp();
    process.exit(1);
  }

  try {
    let buffer = null;
    let ext = "";

    if (command === "tts") {
      const provider = resolveTtsProvider(opts);
      const model = opts.model || DEFAULT_TTS_MODELS[provider] || "tts-1";

      if (provider === "siliconflow") {
        requireKey("SILICONFLOW_API_KEY", SILICONFLOW_API_KEY);
        buffer = await ttsOpenAICompatible(opts, model, SILICONFLOW_BASE_URL, SILICONFLOW_API_KEY);
      } else if (provider === "minimax") {
        requireKey("MINIMAX_API_KEY", MINIMAX_API_KEY);
        buffer = await ttsMinimax(opts, model);
      } else if (provider === "elevenlabs") {
        requireElevenlabsKey();
        buffer = await ttsElevenlabs(opts, model);
      } else if (provider === "relay") {
        requireKey("RELAY_API_KEY", RELAY_API_KEY);
        if (!RELAY_BASE_URL) {
          console.error("Error: RELAY_BASE_URL not configured for provider \"relay\".");
          process.exit(1);
        }
        buffer = await ttsOpenAICompatible(opts, model, RELAY_BASE_URL, RELAY_API_KEY);
      } else {
        requireKey("OPENAI_API_KEY", OPENAI_API_KEY);
        buffer = await ttsOpenAICompatible(opts, model, OPENAI_BASE_URL, OPENAI_API_KEY);
      }
      ext = opts.format && opts.format !== "mpeg" ? opts.format : "mp3";
    } else if (command === "music") {
      requireKey("MINIMAX_API_KEY", MINIMAX_API_KEY);
      const model = opts.model || DEFAULT_MUSIC_MODEL;
      if (opts.lyricsFile && !opts.lyrics) {
        opts.lyrics = fs.readFileSync(path.resolve(opts.lyricsFile), "utf-8");
      }
      buffer = await musicMinimax(opts, model);
      ext = opts.format === "wav" ? "wav" : "mp3";
    } else if (command === "lyrics") {
      requireKey("MINIMAX_API_KEY", MINIMAX_API_KEY);
      const lyrics = await lyricsMinimax(opts);
      console.log(lyrics);
      return;
    } else if (command === "sfx") {
      const provider = opts.provider || "woosh";
      const model = opts.model || (provider === "elevenlabs" ? "eleven_text_to_sound_v3" : DEFAULT_SFX_MODEL);
      if (/[\u4e00-\u9fff]/.test(opts.text) && ["woosh", "mmaudio", "mmaudio-local"].includes(provider)) {
        console.warn(
          "提示: Woosh/MMAudio 使用英文 CLIP/CLAP 文本编码器，中文提示词会被 tokenizer 切碎，" +
          "结果容易出现人声/噪声或内容很弱。建议改用英文描述音效。",
        );
      }
      if (provider === "mmaudio") {
        requireKey("MMAUDIO_API_KEY", MMAUDIO_API_KEY);
        buffer = await sfxMmaudio(opts, model);
        ext = opts.format === "mp3" ? "mp3" : "wav";
      } else if (provider === "mmaudio-local") {
        buffer = await sfxMmaudioLocal(opts, model);
        ext = opts.format === "wav" ? "wav" : "flac";
      } else if (provider === "elevenlabs") {
        requireElevenlabsKey();
        buffer = await sfxElevenlabs(opts, model);
        ext = "mp3";
      } else {
        buffer = await sfxWoosh(opts, model);
        ext = "flac";
      }
    } else {
      console.error(`Error: unknown command "${command}". Use tts | music | lyrics | sfx.`);
      printHelp();
      process.exit(1);
    }

    const outputPath = resolveAudioPath(opts, ext);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    console.log(outputPath);
  } catch (err) {
    if (command === "sfx" && !opts.provider) {
      console.error(
        "提示: 本地 Woosh 服务未运行或不可达。请先启动: uv run --extra cuda uvicorn api.api_server:app --host 0.0.0.0 --port 8000",
      );
    }
    console.error("Audio generation failed:", err.message);
    process.exit(1);
  }
}

/**
 * Exit with a clear message when a required API key is missing.
 */
function requireKey(name, value) {
  if (!value || value === "sk-xxx" || value === "your-api-key") {
    console.error(`Error: no valid ${name} configured.`);
    console.error(`Set ${name} in the environment or in a .env file next to sonic.js.`);
    process.exit(1);
  }
}

/**
 * ElevenLabs requires the new "sk_"-prefixed key format.
 * Old hex-string keys (e.g. 739d...) are rejected with invalid_api_key_prefix.
 */
function requireElevenlabsKey() {
  requireKey("ELEVENLABS_API_KEY", ELEVENLABS_API_KEY);
  if (!/^sk_[A-Za-z0-9]{48}$/.test(ELEVENLABS_API_KEY)) {
    console.error("Error: ELEVENLABS_API_KEY is not a valid ElevenLabs key.");
    console.error("Expected format: exactly 51 chars, \"sk_\" + 48 alphanumeric (e.g. sk_xxxx...).");
    console.error("Copy a fresh key from:");
    console.error("  https://elevenlabs.io/app/settings/api-keys  (Profile -> API Keys, create new)");
    process.exit(1);
  }
}

main();

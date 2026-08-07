import { loadEnv } from "./env.js";

loadEnv();

// Provider endpoints & keys
export const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const SILICONFLOW_BASE_URL = process.env.SILICONFLOW_BASE_URL || "https://api.siliconflow.cn/v1";
export const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY || "";
export const RELAY_BASE_URL = process.env.RELAY_BASE_URL || "";
export const RELAY_API_KEY = process.env.RELAY_API_KEY || "";
export const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || "https://api.minimaxi.com";
export const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "";
export const ELEVENLABS_BASE_URL = process.env.ELEVENLABS_BASE_URL || "https://api.elevenlabs.io";
export const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
export const MMAUDIO_BASE_URL = process.env.MMAUDIO_BASE_URL || "https://mmaudio.net";
export const MMAUDIO_API_KEY = process.env.MMAUDIO_API_KEY || "";
export const MMAUDIO_LOCAL_URL = process.env.MMAUDIO_LOCAL_URL || "http://127.0.0.1:8001";
export const WOOSH_URL = process.env.WOOSH_URL || "http://127.0.0.1:8000";

// Optional HTTP proxy (e.g. "http://127.0.0.1:7890"). Required to reach
// blocked endpoints such as api.elevenlabs.io from some networks.
export const PROXY_URL =
  process.env.HTTPS_PROXY ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.http_proxy ||
  "";

// Default models per provider
export const DEFAULT_TTS_MODELS = {
  siliconflow: "FunAudioLLM/CosyVoice2-0.5B",
  openai: "tts-1",
  minimax: "speech-02-hd",
  elevenlabs: "eleven_multilingual_v2",
  relay: "",
};

export const DEFAULT_MUSIC_MODEL = "music-3.0";
export const DEFAULT_SFX_MODEL = "Woosh-DFlow";

// Output format -> file extension
export const EXT_BY_FORMAT = Object.freeze({
  mp3: "mp3",
  wav: "wav",
  opus: "opus",
  pcm: "pcm",
  flac: "flac",
  ogg: "ogg",
  m4a: "m4a",
});

import {
  ELEVENLABS_API_KEY,
  ELEVENLABS_BASE_URL,
  MMAUDIO_API_KEY,
  MMAUDIO_BASE_URL,
  MMAUDIO_LOCAL_URL,
  MINIMAX_API_KEY,
  MINIMAX_BASE_URL,
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
  RELAY_API_KEY,
  RELAY_BASE_URL,
  SILICONFLOW_API_KEY,
  SILICONFLOW_BASE_URL,
  WOOSH_URL,
} from "./config.js";
import { fetchBuffer, postJson, request } from "./http.js";

/**
 * Infer the TTS provider from the model name; explicit --provider wins.
 */
export function resolveTtsProvider(opts) {
  if (opts.provider) return opts.provider;
  const m = opts.model;
  if (m.startsWith("FunAudioLLM/") || m.startsWith("fishaudio/") || m.startsWith("fnlp/")) {
    return "siliconflow";
  }
  if (m.startsWith("speech-")) return "minimax";
  if (m.startsWith("eleven_") || m.includes("elevenlabs")) return "elevenlabs";
  if (m.includes("/") && RELAY_BASE_URL && RELAY_API_KEY) return "relay";
  if (m === "tts-1" || m.startsWith("gpt-4o-mini-tts") || m.startsWith("gpt-5")) return "openai";
  return "siliconflow";
}

/**
 * OpenAI-compatible TTS — POST {base}/audio/speech, returns audio binary.
 * Used by SiliconFlow (CosyVoice2 / Fish-Speech), OpenAI and relays.
 */
export async function ttsOpenAICompatible(opts, model, baseUrl, apiKey) {
  const base = baseUrl.replace(/\/+$/, "");
  const body = { model, input: opts.text };
  if (opts.voice) body.voice = opts.voice;
  if (opts.format) body.response_format = opts.format;
  if (opts.speed) body.speed = Number(opts.speed);
  if (opts.sampleRate) body.sample_rate = Number(opts.sampleRate);

  const res = await request(`${base}/audio/speech`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error [${res.status}]: ${res.buffer.toString("utf-8").slice(0, 300)}`);
  }
  return res.buffer;
}

/**
 * Decode MiniMax audio payloads — hex-encoded (docs) or base64 (some hosts).
 */
export function decodeMiniMaxAudio(payload) {
  const trimmed = String(payload).trim();
  if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length % 2 === 0) {
    return Buffer.from(trimmed, "hex");
  }
  return Buffer.from(trimmed, "base64");
}

/**
 * MiniMax reports auth/business errors in the body with HTTP 200.
 */
export function checkMiniMaxResult(result) {
  const br = result?.base_resp;
  if (br && br.status_code !== 0) {
    throw new Error(`MiniMax error [${br.status_code}]: ${br.status_msg || "unknown"}`);
  }
}

/**
 * MiniMax TTS — POST /v1/t2a_v2, returns audio buffer.
 */
export async function ttsMinimax(opts, model) {
  const base = MINIMAX_BASE_URL.replace(/\/+$/, "");
  const url = `${base}/v1/t2a_v2`;
  const body = {
    model,
    text: opts.text,
    voice_setting: {
      voice_id: opts.voice || "male-qn-qingse",
      speed: opts.speed ? Number(opts.speed) : 1,
      vol: 1,
    },
    audio_setting: {
      sample_rate: opts.sampleRate ? Number(opts.sampleRate) : 32000,
      bitrate: 128000,
      format: opts.format === "wav" ? "wav" : "mp3",
    },
  };
  const result = await postJson(url, { Authorization: `Bearer ${MINIMAX_API_KEY}` }, body);
  checkMiniMaxResult(result);
  const audio = result?.data?.audio;
  if (!audio) {
    throw new Error(`MiniMax TTS returned no audio: ${JSON.stringify(result).slice(0, 300)}`);
  }
  return decodeMiniMaxAudio(audio);
}

/**
 * ElevenLabs TTS — POST /v1/text-to-speech/{voice_id}, returns audio binary.
 */
export async function ttsElevenlabs(opts, model) {
  const base = ELEVENLABS_BASE_URL.replace(/\/+$/, "");
  // "Adam" — free tier can't use library voices (e.g. Rachel) via the API
  const voice = opts.voice || "pNInz6obpgDQGcFmaJgB";
  const body = { text: opts.text, model_id: model };
  if (opts.speed) body.speed = Number(opts.speed);
  const res = await request(`${base}/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
      Accept: "audio/mpeg",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error [${res.status}]: ${res.buffer.toString("utf-8").slice(0, 300)}`);
  }
  return res.buffer;
}

/**
 * MiniMax music — POST /v1/music_generation, returns audio buffer (mp3/wav).
 */
export async function musicMinimax(opts, model) {
  const base = MINIMAX_BASE_URL.replace(/\/+$/, "");
  const body = {
    model,
    prompt: opts.text,
    output_format: "url",
    audio_setting: {
      sample_rate: opts.sampleRate ? Number(opts.sampleRate) : 44100,
      bitrate: 256000,
      format: opts.format === "wav" ? "wav" : "mp3",
    },
  };
  if (opts.lyrics) body.lyrics = opts.lyrics;
  if (opts.instrumental) body.is_instrumental = true;
  if (opts.lyricsOptimizer) body.lyrics_optimizer = true;
  if (opts.cover) body.audio_url = opts.cover;

  const result = await postJson(`${base}/v1/music_generation`, {
    Authorization: `Bearer ${MINIMAX_API_KEY}`,
  }, body);
  checkMiniMaxResult(result);
  const audioUrl = result?.data?.audio || result?.data?.audio_url;
  if (!audioUrl) {
    throw new Error(`MiniMax music returned no audio: ${JSON.stringify(result).slice(0, 300)}`);
  }
  return fetchBuffer(audioUrl);
}

/**
 * MiniMax lyrics — POST /v1/lyrics_generation, returns lyrics text.
 */
export async function lyricsMinimax(opts) {
  const base = MINIMAX_BASE_URL.replace(/\/+$/, "");
  const result = await postJson(`${base}/v1/lyrics_generation`, {
    Authorization: `Bearer ${MINIMAX_API_KEY}`,
  }, {
    mode: opts.mode || "write_full_song",
    prompt: opts.text,
  });
  checkMiniMaxResult(result);
  const lyrics = result?.lyrics || result?.data?.lyrics || result?.data?.text;
  if (!lyrics) {
    throw new Error(`MiniMax lyrics returned no content: ${JSON.stringify(result).slice(0, 300)}`);
  }
  const title = result?.song_title;
  const tags = result?.style_tags;
  const header = title ? `# ${title}${tags ? ` [${tags}]` : ""}` : "";
  const normalized = String(lyrics).replace(/\\n/g, "\n");
  return header ? `${header}\n\n${normalized}` : normalized;
}

/**
 * Sony Woosh (local) — POST {WOOSH_URL}/generate, returns audio binary (FLAC).
 * Requires the local Woosh FastAPI server: `uv run uvicorn api.api_server:app --port 8000`.
 */
export async function sfxWoosh(opts, model) {
  const base = WOOSH_URL.replace(/\/+$/, "");
  const args = {
    prompt: opts.text,
    model: model || "Woosh-DFlow",
    num_steps: opts.steps || 8,
    cfg: opts.cfg ? Number(opts.cfg) : 1,
  };
  if (opts.seed) args.seed = Number(opts.seed);

  const res = await request(`${base}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ version: "0.1", token: "local", args }),
  });
  if (!res.ok) {
    throw new Error(`API error [${res.status}]: ${res.buffer.toString("utf-8").slice(0, 300)}`);
  }
  return res.buffer;
}

/**
 * ElevenLabs sound effects — POST /v1/sound-generation, returns audio binary.
 */
export async function sfxElevenlabs(opts, model) {
  const base = ELEVENLABS_BASE_URL.replace(/\/+$/, "");
  const body = { text: opts.text, model_id: model };
  if (opts.duration) body.duration_seconds = Number(opts.duration);
  if (opts.promptInfluence) body.prompt_influence = Number(opts.promptInfluence);
  const res = await request(`${base}/v1/sound-generation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
      Accept: "audio/mpeg",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error [${res.status}]: ${res.buffer.toString("utf-8").slice(0, 300)}`);
  }
  return res.buffer;
}

/**
 * MMAudio cloud API — POST /api/text-to-audio or /api/video-to-audio, returns audio buffer.
 * No local install needed; requires an MMAudio API key (https://mmaudio.net).
 */
export async function sfxMmaudio(opts, model) {
  const base = MMAUDIO_BASE_URL.replace(/\/+$/, "");
  const isVideo = Boolean(opts.video);
  const body = {
    prompt: opts.text,
    duration: opts.duration ? Number(opts.duration) : 8,
    num_steps: opts.steps || 25,
    cfg_strength: opts.cfg ? Number(opts.cfg) : 4.5,
  };
  if (opts.seed) body.seed = Number(opts.seed);
  if (opts.negative) body.negative_prompt = opts.negative;
  if (isVideo) body.video_url = opts.video;

  const result = await postJson(
    `${base}/api/${isVideo ? "video-to-audio" : "text-to-audio"}`,
    { Authorization: `Bearer ${MMAUDIO_API_KEY}` },
    body,
  );
  const audio = isVideo ? result?.video?.url : result?.audio?.url;
  if (!audio) {
    throw new Error(`MMAudio returned no audio: ${JSON.stringify(result).slice(0, 300)}`);
  }
  return fetchBuffer(audio);
}

/**
 * Local MMAudio server (own GPU) — POST {MMAUDIO_LOCAL_URL}/generate, returns audio bytes.
 * Started by scripts/install/mmaudio.ps1 / mmaudio.sh (zero per-call cost).
 */
export async function sfxMmaudioLocal(opts, model) {
  const base = MMAUDIO_LOCAL_URL.replace(/\/+$/, "");
  const body = {
    prompt: opts.text,
    negative_prompt: opts.negative || "",
    duration: opts.duration ? Number(opts.duration) : 8,
    cfg_strength: opts.cfg ? Number(opts.cfg) : 4.5,
    num_steps: opts.steps || 25,
    seed: opts.seed ? Number(opts.seed) : 42,
    format: opts.format === "wav" ? "wav" : "flac",
  };
  if (opts.video) {
    if (/^https?:\/\//.test(opts.video)) body.video_url = opts.video;
    else body.video_path = opts.video;
  }

  const res = await request(`${base}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error [${res.status}]: ${res.buffer.toString("utf-8").slice(0, 300)}`);
  }
  return res.buffer;
}

---
name: models-voice
description: Text-to-speech models — SiliconFlow CosyVoice2 / Fish-Speech, MiniMax Speech, Qwen-Audio-TTS, OpenAI TTS, ElevenLabs — capabilities, API parameters, and when to use each.
---

# Voice / TTS Models

Recommended order for a China-based workflow: **SiliconFlow (CosyVoice2) → MiniMax Speech → OpenAI / ElevenLabs**.

## SiliconFlow — CosyVoice2 / Fish-Speech (recommended, key available)

OpenAI-compatible `POST {base}/audio/speech`:

| Model id | Notes |
|----------|-------|
| `FunAudioLLM/CosyVoice2-0.5B` | Alibaba CosyVoice2, natural Chinese, zero-shot cloning |
| `fishaudio/fish-speech-1.5` | Fast, many preset voices (`fishaudio/fish-speech-1.5:alex`, `:anna`, `:bella`, `:benjamin`, ...) |
| `fnlp/MOSS-TTSD-v0.5` | MOSS TTS |

Parameters: `input` (1–128000 chars), `voice`, `response_format` (`mp3`/`opus`/`wav`/`pcm`), `sample_rate` (8000–48000), `speed` (0.25–4.0). Response is raw audio binary.

## MiniMax Speech

- Models: `speech-02-turbo`, `speech-02-hd`, `speech-2.6-hd`, `speech-2.8-hd`, `speech-2.8-turbo`.
- Endpoint: `POST https://api.minimaxi.com/v1/t2a_v2` (China) or `api.minimax.io` (international).
- Body: `{ model, text, voice_setting: { voice_id, speed, vol }, audio_setting: { format, sample_rate, bitrate } }`.
- Response: `data.audio` hex-encoded (or base64 on some hosts) — decoded by the script.
- Good when you want high-quality Chinese voices with Alipay top-up.

## Qwen-Audio-3.0-TTS (Alibaba, leaderboard #1)

- Released 2026-07-20; tops the Artificial Analysis TTS leaderboard.
- Model ids: `qwen-audio-3.0-tts-plus` (high quality), `qwen-audio-3.0-tts-flash` (realtime, ~300ms first packet).
- Available via 阿里云百炼 (DashScope) — China-friendly, not yet wired into sonic.js (use the provider's SDK/HTTP API directly).

## OpenAI TTS

- Models: `tts-1`, `gpt-4o-mini-tts`. Same `/v1/audio/speech` shape as SiliconFlow.
- Good for English narration; needs a foreign card or a relay.

## ElevenLabs

- Best-in-class multilingual + emotion control; `eleven_multilingual_v2`, `eleven_turbo_v2_5`, etc.
- TTS: `POST /v1/text-to-speech/{voice_id}`; SFX: `POST /v1/sound-generation` (see models-sfx).
- **Default voice is "Adam"** (`pNInz6obpgDQGcFmaJgB`) — the free tier ships 21 premade voices (Adam, Sarah, Bella, Lily, ...) and cannot use library voices via the API ("Rachel" is not included and returns `402 paid_plan_required`). List your voices with `GET /v1/voices`, then pass any of them via `-v <voice_id>`. Free tier: 10k characters.
- Multilingual TTS works for Chinese and other languages via `eleven_multilingual_v2` — e.g. `node sonic.js tts "你好世界" --provider elevenlabs`.
- Needs a foreign card and a proxy from mainland China.

## Choosing

- Chinese voiceover / narration → CosyVoice2 or MiniMax Speech
- Batch/cheap → Fish-Speech or CosyVoice2 (SiliconFlow)
- Real-time interactive → Qwen-Audio-3.0-TTS-flash
- Best multilingual quality → ElevenLabs (if payment/proxy are available)

<!--
Source references:
- https://docs.siliconflow.com/en/api-reference/audio/create-speech
- https://platform.minimaxi.com/docs/api-reference/speech-t2a-http
- https://help.aliyun.com/zh/model-studio/non-realtime-tts-user-guide
- https://elevenlabs.io/docs
-->

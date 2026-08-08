---
name: sonic
description: AI voice (TTS), music, lyrics, and sound-effect generation for agents. Use when the user asks to generate, synthesize, or create speech, voiceovers, songs, music, background music, lyrics, or sound effects. Provides a zero-dependency Node.js script covering SiliconFlow / MiniMax / OpenAI / ElevenLabs TTS, MiniMax music, and local Sony Woosh sound effects.
metadata:
  author: Hairy
  version: "2026.8.7"
---

# Sonic

Generate voice, music, lyrics, and sound effects through a single zero-dependency Node.js script. The script talks directly to each provider's API — no SDKs, no npm dependencies — and saves the audio to disk.

## Model selection

Picked for a China-based workflow (Alipay/WeChat top-up, no foreign card required):

| Asset | Recommended (priority order) | Notes |
|-------|------------------------------|-------|
| Voice / TTS | SiliconFlow CosyVoice2 → MiniMax Speech → OpenAI TTS / ElevenLabs | SiliconFlow is OpenAI-compatible and already has a key |
| Music | MiniMax Music 3.0 → Alibaba Bailian Fun-Music → Suno (third-party relays) | MiniMax has an official API + China payment |
| Sound effects | Local MMAudio → Local Sony Woosh → MMAudio cloud → ElevenLabs SFX | Local MMAudio/Woosh run on your NVIDIA GPU for free (auto-installed via `scripts/setup-mmaudio.*` / `scripts/setup-woosh.*`); MMAudio cloud is zero-install (key); ElevenLabs needs a key + proxy |

## Quick start

```bash
# TTS (defaults to SiliconFlow CosyVoice2)
node scripts/sonic.js tts "Hello, world" -o hi.mp3

# Music with auto-written lyrics
node scripts/sonic.js music "cheerful jazz with brass and double bass, café style" -o song.mp3 --lyrics-optimizer

# Instrumental only
node scripts/sonic.js music "epic movie soundtrack, orchestral" -o bgm.mp3 --instrumental

# Lyrics
node scripts/sonic.js lyrics "a summer day at the beach"

# Sound effect (cloud MMAudio, zero install — needs key)
node scripts/sonic.js sfx "rain falling on a wooden roof" -o rain.wav --provider mmaudio

# Sound effect (local MMAudio on your GPU — free, auto-installed by the agent)
node scripts/sonic.js sfx "rain falling on a wooden roof" -o rain.flac --provider mmaudio-local

# Sound effect (local Sony Woosh — auto-installed by the agent)
node scripts/sonic.js sfx "footsteps crunching in the snow" -o steps.flac
```

## Setup

Requires at least one API key (`SILICONFLOW_API_KEY`, `MINIMAX_API_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, or `MMAUDIO_API_KEY`). The local Woosh sound-effect channel needs no key — the agent installs it automatically via `scripts/setup-woosh.*`. On first run, follow [core-setup](references/core-setup.md) — including the required AGENTS.md merge.

## References

### Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Usage | Commands (tts/music/lyrics/sfx), options, exit codes | [core-usage](references/core-usage.md) |
| Setup | API keys, `.env`, local Woosh server, required AGENTS.md merge | [core-setup](references/core-setup.md) |
| How it works | Module layout, provider channels, config table | [core-script](references/core-script.md) |

### Models

| Topic | Description | Reference |
|-------|-------------|-----------|
| Voice / TTS | CosyVoice2, Fish-Speech, Qwen-Audio-TTS, MiniMax Speech, OpenAI/ElevenLabs | [models-voice](references/models-voice.md) |
| Music | MiniMax Music 3.0, Bailian Fun-Music, Suno, Udio, Stable Audio, MusicGen | [models-music](references/models-music.md) |
| Sound effects | Sony Woosh (local API), MMAudio, ElevenLabs SFX, Stable Audio SFX | [models-sfx](references/models-sfx.md) |

### Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Prompt recipes | Style/genre/BPM prompts for music, SFX descriptions, voice settings | [best-practices-prompts](references/best-practices-prompts.md) |

---
name: sonic
description: AI voice (TTS), music, lyrics, and sound-effect generation for agents. Use when the user asks to generate, synthesize, or create speech, voiceovers, songs, music, background music, lyrics, or sound effects. Provides a zero-dependency Node.js script covering SiliconFlow / MiniMax / OpenAI / ElevenLabs TTS, MiniMax music, and local Sony Woosh / MMAudio sound effects.
metadata:
  author: Hairy
  version: "2026.8.11"
---

# Sonic

Generate voice, music, lyrics, and sound effects through `scripts/sonic.js` — a zero-dependency Node.js CLI (Node 18+, no npm install). It saves audio to disk and prints the absolute path.

## Quick start

```bash
# TTS (defaults to SiliconFlow CosyVoice2)
node scripts/sonic.js tts "Hello, world" -o hi.mp3

# Music with auto-written lyrics / instrumental only
node scripts/sonic.js music "cheerful jazz with brass and double bass, café style" -o song.mp3 --lyrics-optimizer
node scripts/sonic.js music "epic movie soundtrack, orchestral" -o bgm.mp3 --instrumental

# Lyrics
node scripts/sonic.js lyrics "a summer day at the beach"

# Sound effects — cloud MMAudio (zero install, needs key) / local Woosh (free, auto-installed)
node scripts/sonic.js sfx "rain falling on a wooden roof" -o rain.wav --provider mmaudio
node scripts/sonic.js sfx "footsteps crunching in the snow" -o steps.flac
```

## Model selection

China-friendly priority order (Alipay/WeChat top-up, no foreign card):

| Asset | Recommended (priority order) | Notes |
|-------|------------------------------|-------|
| Voice / TTS | SiliconFlow CosyVoice2 → MiniMax Speech → OpenAI TTS / ElevenLabs | SiliconFlow is OpenAI-compatible and already keyed |
| Music | MiniMax Music 3.0 → Bailian Fun-Music → Suno (third-party relays) | MiniMax has an official API + China payment |
| Sound effects | Local MMAudio → Local Sony Woosh → MMAudio cloud → ElevenLabs SFX | Local channels run on an NVIDIA GPU, free, auto-installed by the agent |

## Key workflows

- **Local SFX prompts must be English** — MMAudio and Woosh use English CLIP/CLAP text encoders; non-English prompts produce garbled, voice-like artifacts. Add `--negative "speech, voice, human talking, vocals, singing"` to suppress them.
- **Music prompts**: `{genre/style} + {instruments} + {mood} + {tempo} + {scene}`; `--instrumental` for pure music, `--lyrics-optimizer` or `--lyrics` for vocals. Generation takes tens of seconds to minutes — use a generous timeout.
- **TTS**: `--speed 0.9–1.1` for narration, `1.2+` for ads, `0.8` for audiobook; `-v <voice>` keeps a consistent voice. ElevenLabs' free tier only ships its 21 premade voices (default "Adam") — list them with `GET /v1/voices`.
- **Local channels auto-install**: when local Woosh / MMAudio is needed but missing, run `scripts/install/woosh.*` / `scripts/install/mmaudio.*` with `-Start` / `--start` yourself — never ask the user to install by hand. Servers idle-exit after 15 minutes; restart before retrying a failed request.
- **Woosh's API server serves Woosh-DFlow (fast) only**; quality and video-to-audio modes need the Gradio UI.

## References — load on demand

| When | Reference |
|------|-----------|
| Full CLI options and exit codes | [core-usage](references/core-usage.md) |
| First run with no API key configured (env keys, AGENTS.md merge) | [core-setup](references/core-setup.md) |
| Debugging the pipeline or editing the scripts | [core-script](references/core-script.md) |

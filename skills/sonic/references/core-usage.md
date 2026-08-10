---
name: core-usage
description: How to invoke sonic.js — the tts / music / lyrics / sfx commands, options, and exit codes.
---

# Usage

Run the script with Node.js (18+). Four commands cover the audio surface:
Run `node scripts/sonic.js --help` for the full flag list.

```bash
node sonic.js tts "text" -o out.mp3
node sonic.js music "style prompt" -o song.mp3
node sonic.js lyrics "topic"
node sonic.js sfx "sound description" -o out.flac
```

## tts — text to speech

Provider is inferred from the model id (`FunAudioLLM/`, `fishaudio/`, `fnlp/` → siliconflow; `speech-*` → minimax; `tts-1`/`gpt-*` → openai; `eleven_*` → elevenlabs), or forced with `--provider`. Default: siliconflow `FunAudioLLM/CosyVoice2-0.5B`.

```bash
node sonic.js tts "hello" -m FunAudioLLM/CosyVoice2-0.5B --voice fishaudio/fish-speech-1.5:alex
node sonic.js tts "good morning" -m tts-1 --provider openai --speed 1.2
node sonic.js tts "Hello" --provider minimax -v female-shaonv
```

## music — songs and instrumentals (MiniMax)

```bash
node sonic.js music "upbeat 1940s big-band swing jazz" -o song.mp3 --lyrics-optimizer
node sonic.js music "healing folk ballad" -o song.mp3 --lyrics "by the sea in summer..."
node sonic.js music "epic orchestral, crescendo" -o bgm.mp3 --instrumental
node sonic.js music "lazy jazz lounge vibe" -o cover.mp3 --cover https://example.com/original.mp3
```

Music generation is slow (tens of seconds to minutes) — set a generous timeout.

## lyrics — generate lyrics (MiniMax)

```bash
node sonic.js lyrics "summer seaside" --mode write_full_song
```

Prints the lyrics (with `[Verse]` / `[Chorus]` structure tags) to stdout.

## sfx — sound effects

```bash
# Local Sony Woosh (default, server auto-installed by the agent)
node sonic.js sfx "footsteps crunching in the snow" -o steps.flac

# MMAudio cloud (zero install, needs MMAUDIO_API_KEY)
node sonic.js sfx "rain falling on a wooden roof" -o rain.wav --provider mmaudio --duration 10
node sonic.js sfx "forest birdsong" -o forest.wav --provider mmaudio --video https://example.com/video.mp4

# Local MMAudio (your GPU, free — auto-installed by the agent)
node sonic.js sfx "rain falling on a wooden roof" -o rain.flac --provider mmaudio-local --duration 10

# ElevenLabs (needs key + proxy)
node sonic.js sfx "laser gun firing" -o laser.mp3 --provider elevenlabs --duration 3
```

Local SFX prompts must be in English (see SKILL.md); add `--negative "speech, voice"` to suppress artifacts.

## Options

| Option | Applies to | Description |
|--------|-----------|-------------|
| `-o, --output <path>` | all | Output file or directory; default `audio-<timestamp>.<ext>` |
| `-m, --model <id>` | all | Model id (default per provider) |
| `--provider <name>` | tts/sfx | Force provider |
| `-v, --voice <voice>` | tts | Voice id (e.g. `fishaudio/fish-speech-1.5:alex`, MiniMax voice ids) |
| `-f, --format <fmt>` | tts/music | `mp3`/`wav`/`opus`/`pcm` (tts), `mp3`/`wav` (music) |
| `--speed <0.25-4>` | tts | Speech speed (default 1) |
| `--duration <sec>` | sfx (elevenlabs/mmaudio) | Effect length |
| `--video <url>` | sfx (mmaudio) | Video URL for video-to-audio |
| `--negative <text>` | sfx (mmaudio) | Negative prompt |
| `--lyrics <text>` | music | Song lyrics |
| `--lyrics-file <path>` | music | Read song lyrics from a file |
| `--instrumental` | music | Instrumental only |
| `--lyrics-optimizer` | music | Auto-write lyrics from prompt |
| `--cover <url>` | music | Reference audio for a cover |
| `--seed <n>` | sfx (woosh) | Reproducibility |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success, file saved and path printed to stdout (or lyrics printed) |
| `1` | Missing command/text/key, unknown option, or API failure |

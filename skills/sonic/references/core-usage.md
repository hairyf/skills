---
name: core-usage
description: How to invoke sonic.js — the tts / music / lyrics / sfx commands, options, and exit codes.
---

# Usage

Run the script with Node.js (18+). Four commands cover the audio surface:

```bash
node sonic.js tts "text" -o out.mp3
node sonic.js music "style prompt" -o song.mp3
node sonic.js lyrics "topic"
node sonic.js sfx "sound description" -o out.flac
```

## tts — text to speech

```bash
node sonic.js tts "你好，世界" -o hi.mp3
node sonic.js tts "hello" -m FunAudioLLM/CosyVoice2-0.5B --voice fishaudio/fish-speech-1.5:alex
node sonic.js tts "good morning" -m tts-1 --provider openai --speed 1.2
node sonic.js tts "你好" --provider minimax -v female-shaonv
```

Provider is inferred from the model id (`FunAudioLLM/`, `fishaudio/`, `fnlp/` → siliconflow; `speech-*` → minimax; `tts-1`/`gpt-*` → openai; `eleven_*` → elevenlabs), or forced with `--provider`. Default: siliconflow `FunAudioLLM/CosyVoice2-0.5B`.

## music — songs and instrumentals (MiniMax)

```bash
# Full song with auto-written lyrics
node sonic.js music "欢快的 1940 年代大乐队摇摆爵士" -o song.mp3 --lyrics-optimizer

# Song with provided lyrics
node sonic.js music "治愈系民谣" -o song.mp3 --lyrics "我在夏天的海边..."

# Song with lyrics from a file (long lyrics / from the lyrics command)
node sonic.js lyrics "毕业季的校园" > lyrics.txt
node sonic.js music "青春民谣" -o song.mp3 --lyrics-file lyrics.txt

# Instrumental
node sonic.js music "史诗管弦乐，渐强" -o bgm.mp3 --instrumental

# Cover version from a reference audio URL
node sonic.js music "爵士慵懒夜店风" -o cover.mp3 --cover https://example.com/original.mp3
```

Music generation is slow (tens of seconds to minutes) — set a generous timeout.

## lyrics — generate lyrics (MiniMax)

```bash
node sonic.js lyrics "夏日的海边" --mode write_full_song
```

Prints the lyrics (with `[Verse]`/`[Chorus]` structure tags) to stdout.

## sfx — sound effects

```bash
# Local Sony Woosh (default, needs the server running)
node sonic.js sfx "脚步声踩在雪地上" -o steps.flac --steps 8

# MMAudio cloud (zero install, needs MMAUDIO_API_KEY)
node sonic.js sfx "雨声敲打木屋顶" -o rain.wav --provider mmaudio --duration 10
node sonic.js sfx "森林鸟鸣" -o forest.wav --provider mmaudio --video https://example.com/video.mp4

# Local MMAudio (your GPU, free — auto-installed by the agent)
node sonic.js sfx "雨声敲打木屋顶" -o rain.flac --provider mmaudio-local --duration 10
node sonic.js sfx "森林鸟鸣" -o forest.flac --provider mmaudio-local --video C:\clips\forest.mp4

# ElevenLabs (needs key + proxy)
node sonic.js sfx "laser gun firing" -o laser.mp3 --provider elevenlabs --duration 3
```

The local servers are auto-installed by the agent (`scripts/setup-woosh.*` / `scripts/setup-mmaudio.*`) — the user never installs them by hand.

## Options

| Option | Applies to | Description |
|--------|-----------|-------------|
| `-o, --output <path>` | all | Output file or directory; default `audio-<timestamp>.<ext>` |
| `-m, --model <id>` | all | Model id (default per provider) |
| `--provider <name>` | tts/sfx | Force provider |
| `-v, --voice <voice>` | tts | Voice id (e.g. `fishaudio/fish-speech-1.5:alex`, MiniMax voice ids) |
| `-f, --format <fmt>` | tts/music | `mp3`/`wav`/`opus`/`pcm` (tts), `mp3`/`wav` (music) |
| `--speed <0.25-4>` | tts | Speech speed (default 1) |
| `--sample-rate <hz>` | tts/music | Output sample rate |
| `--duration <sec>` | sfx (elevenlabs/mmaudio) | Effect length |
| `--prompt-influence <0-1>` | sfx (elevenlabs) | Prompt adherence |
| `--video <url>` | sfx (mmaudio) | Video URL for video-to-audio |
| `--negative <text>` | sfx (mmaudio) | Negative prompt |
| `--lyrics <text>` | music | Song lyrics |
| `--lyrics-file <path>` | music | Read song lyrics from a file |
| `--instrumental` | music | Instrumental only |
| `--lyrics-optimizer` | music | Auto-write lyrics from prompt |
| `--cover <url>` | music | Reference audio for a cover |
| `--steps <n>` | sfx (woosh) | Inference steps (default 8) |
| `--cfg <float>` | sfx (woosh) | Guidance (default 1) |
| `--seed <n>` | sfx (woosh) | Reproducibility |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success, file saved and path printed to stdout (or lyrics printed) |
| `1` | Missing command/text/key, unknown option, or API failure |

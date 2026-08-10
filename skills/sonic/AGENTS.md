# Audio Generation Capability

When the user asks to generate **voice, speech, voiceovers, songs, music, background music, lyrics, or sound effects**, use `scripts/sonic.js`:

```bash
node scripts/sonic.js tts "<text>" -o <out.mp3> [options]
node scripts/sonic.js music "<style prompt>" -o <out.mp3> [--lyrics "..." | --instrumental | --lyrics-optimizer]
node scripts/sonic.js lyrics "<topic>"
node scripts/sonic.js sfx "<sound description>" -o <out.flac> [--provider woosh|elevenlabs]
```

## Model selection

- **Voice / TTS** — SiliconFlow (`FunAudioLLM/CosyVoice2-0.5B`) by default, MiniMax Speech as backup, OpenAI/ElevenLabs when configured.
- **Music** — MiniMax Music 3.0 (`music-3.0`). Use `--lyrics-optimizer` to auto-write lyrics, `--instrumental` for pure music, `--cover <url>` for a cover version.
- **Sound effects** — local Sony Woosh (NVIDIA GPU, no key) by default; ElevenLabs SFX when a key is configured.
- **Sound effects (alt)** — local MMAudio on the user's NVIDIA GPU (`--provider mmaudio-local`, free) or MMAudio cloud (`--provider mmaudio`, key only).

## Trigger scenarios

- The user asks to "generate/make/create" a voice, narration, song, BGM, melody, lyrics, or sound effect
- The user needs a voiceover for a video/presentation, or game/UI sound effects
- The user shares a style/genre/mood description and wants matching music or audio

## Auto-install (never ask the user to install manually)

- When local **Woosh / MMAudio** is needed but not installed, the agent runs `scripts/setup-woosh.ps1` / `scripts/setup-mmaudio.ps1` automatically (Windows) or the matching `.sh` (macOS/Linux), adding `-Start` / `--start` to start the API server directly; never make the user install it by hand.
- Cloud channels (SiliconFlow / MiniMax / OpenAI / ElevenLabs / MMAudio) only need an API key: once the user provides the key, the agent writes it to `scripts/.env` (git-ignored).
- The local MMAudio server exits by itself after 15 idle minutes (`MMAUDIO_IDLE_TIMEOUT=0` disables). If a request fails to connect, restart it with the setup script before retrying.

Save outputs to a sensible path, print the saved file path, and mention the model used. Fall back down the priority order when a provider has no key configured.

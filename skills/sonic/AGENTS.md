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

## 自动安装（不要要求用户手动装环境）

- 需要本地 **Woosh / MMAudio** 且尚未安装时，由 agent 自动运行 `scripts/setup-woosh.ps1` / `scripts/setup-mmaudio.ps1`（Windows）或对应 `.sh`（macOS/Linux），必要时加 `-Start` / `--start` 直接启动 API server；不要让用户手动安装。
- 云端通道（SiliconFlow / MiniMax / OpenAI / ElevenLabs / MMAudio）只需 API key：用户提供 key 后，由 agent 写入 `scripts/.env`（git 已忽略）。

Save outputs to a sensible path, print the saved file path, and mention the model used. Fall back down the priority order when a provider has no key configured.

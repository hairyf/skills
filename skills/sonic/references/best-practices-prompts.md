---
name: best-practices-prompts
description: Prompt recipes and generation best practices for music, sound effects, and voice.
---

# Prompt Recipes

## Music prompts

Structure: `{genre/style} + {instruments} + {mood/emotion} + {tempo/rhythm} + {scene/use case}`.

| Goal | Prompt seed |
|------|-------------|
| Jazz | "欢快的 1940 年代大乐队摇摆爵士，铜管组、Walking Bass、镲片律动，适合咖啡馆" |
| Chill BGM | "lofi hip-hop, warm vinyl crackle, soft piano chords, 70 BPM, study background" |
| Epic | "史诗电影配乐，管弦乐，渐强，定音鼓，80 BPM" |
| Game loop | "轻快像素游戏背景音乐，8-bit chiptune, cheerful, looping 30s" |
| Vocal pop | "流行情歌，钢琴主奏，副歌高亢，适合夜晚" |

- For vocals: use `--lyrics-optimizer` or provide lyrics with structure tags (`[Verse]`, `[Chorus]`, `[Bridge]`, `[Outro]`).
- For pure music: `--instrumental`; describe instruments explicitly (models won't invent them reliably).
- Specify BPM and duration when you need a loop or a specific length.
- Mention a concrete scene ("咖啡馆", "游戏关卡", "雨天开车") — it anchors the mood better than abstract adjectives.

## Sound effect prompts

Structure: `{object/action} + {material/context} + {perspective/distance} + {duration hint}`.

| Goal | Prompt seed |
|------|-------------|
| Footsteps | "footsteps crunching on snow, close perspective, crisp" |
| UI click | "soft UI button click, clean, short" |
| Magic | "whoosh of a magic spell, airy, cinematic, 2 seconds" |
| Combat | "heavy sword impact on metal shield, deep thud, game-style" |
| Ambience | "rain on a tin roof, distant thunder, calm ambience" |

- One effect per prompt; keep it 1–15s (ElevenLabs `--duration 2-3`; Woosh generates ~5s clips).
- State perspective ("close" vs "distant") and style ("game-style", "cinematic", "UI").
- For video sync, Woosh-VFlow/MMAudio analyze the video — describe the on-screen action instead of a mood.

## Voice / TTS settings

- Chinese: CosyVoice2 or MiniMax Speech; specify `--voice` presets for consistency.
- Add punctuation and pauses; TTS reads commas/periods naturally.
- `--speed 0.9–1.1` for narration, `1.2+` for energetic ads, `0.8` for calm audiobook style.
- For multi-line scripts, generate per paragraph to keep intonation stable.

## Iteration workflow

1. Generate 2–3 quick drafts with the fast channel (Woosh-DFlow / Fish-Speech / MiniMax turbo).
2. Refine the winner with the quality channel (Woosh-Flow / CosyVoice2 / MiniMax hd).
3. Use `--seed` on Woosh to reproduce or tweak a specific take.

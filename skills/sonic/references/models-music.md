---
name: models-music
description: Music generation models — MiniMax Music 3.0, Alibaba Bailian Fun-Music, Suno, Udio, Stable Audio, MusicGen — capabilities, APIs, and when to use each.
---

# Music Models

Recommended order for a China-based workflow: **MiniMax Music 3.0 → Alibaba Bailian Fun-Music → Suno (via third-party relays)**.

## MiniMax Music 3.0 (recommended, official API + China payment)

Full pipeline: lyrics generation → music generation → (optional) cover.

- **Lyrics** — `POST https://api.minimaxi.com/v1/lyrics_generation`, body `{ mode: "write_full_song", prompt }` → `data.lyrics` with `[Verse]`/`[Chorus]` tags.
- **Music** — `POST https://api.minimaxi.com/v1/music_generation`, body:
  ```json
  {
    "model": "music-3.0",
    "prompt": "upbeat 1940s big-band swing jazz with brass section, walking bass, cymbal grooves",
    "lyrics": "[Intro]...",            // optional; omit + lyrics_optimizer:true to auto-write
    "is_instrumental": false,          // true for pure music
    "audio_setting": { "sample_rate": 44100, "bitrate": 256000, "format": "mp3" },
    "output_format": "url"
  }
  ```
  → `data.audio` (URL, valid 12–24h — download immediately).
- **Cover** — `music-cover` model with `audio_url` (one-step) or `cover_feature_id` from `POST /v1/music_cover_preprocess` (two-step, editable lyrics).
- Strengths: natural vocals (Music 3.0), instrument control, lyrics in Chinese/English, Alipay/WeChat top-up.

## Alibaba Bailian Fun-Music (Bailing)

- Model: `fun-music-v1`. Endpoint: `POST https://dashscope.aliyuncs.com/api/v1/services/audio/music/generation` with a DashScope key (China-friendly).
- Body: `{ "model": "fun-music-v1", "input": { "prompt": "...", "gender": "female" } }`.
- Generates full male/female-vocal songs in Chinese/English. Task-based (poll for the result).

## Suno (most popular, no official API)

- The most polished end-to-end song tool (v4.5/v5.x): full songs with vocals, 15+ languages, $10–30/mo.
- **No official API** — only third-party relays/aggregators (e.g. Rabbit API, Qingyun Aggregate, Baiwan API) or web scraping. Stability and pricing vary; not recommended as the default channel.

## Others

| Model | Notes |
|-------|-------|
| Udio | Studio-quality alternative; official API restricted to enterprise/closed beta |
| Stable Audio 3 | Open weights (Small/Medium), instrumental + SFX; API via Stability/fal (foreign card) |
| ElevenLabs Music | New entrant, $10/mo |
| MusicGen / YuE / ACE-Step | Open source; self-host or via fal/Replicate |
| Jimeng Music (Volcano Engine) | ByteDance text-to-music API, China-friendly |
| Tiangong Mureka V8 | High vocal/instrumental scores, official API from ~$0.045/song |

## Choosing

- Chinese song with vocals, API + China payment → MiniMax Music 3.0
- Full songs via a hosted China API → Bailian Fun-Music
- Best overall song quality (no API) → Suno via web/relay
- Instrumental / loops → Stable Audio 3

<!--
Source references:
- https://platform.minimaxi.com/docs/guides/music-generation
- https://platform.minimaxi.com/docs/api-reference/music-generation
- https://www.qianwenai.com/models/fun-music-v1
- https://blog.dubspot.com/best-ai-music-generators-2026
-->

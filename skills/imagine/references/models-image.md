---
name: models-image
description: Image generation models — GPT Image 2, Nano Banana (Gemini), SiliconFlow Qwen-Image, OpenAI GPT Image — capabilities, API parameters, and when to use each.
---

# Image Models

The user's priority order for general image generation: **GPT Image 2 → Nano Banana → SiliconFlow Qwen-Image → OpenAI GPT Image**. All four can generate photos, illustrations, and posters; the differences are quality, text rendering, price, and latency.

## GPT Image 2 (`gpt-image-2`, OpenAI)

OpenAI's flagship image model (ChatGPT Images 2.0, released 2026-04). Best overall quality in the list.

- **Capabilities** — 4K output (up to `3840x2160`), photorealistic, accurate instruction following, excellent CJK and multilingual text rendering, strong at layouts/posters with text.
- **Editing** — text + image editing, blends up to 16 input images (compose subjects, styles, references).
- **Parameters** — `size` (`1024x1024`, `1024x1536`, `1536x1024`, `auto`, or arbitrary `WIDTHxHEIGHT` where both are divisible by 16 and aspect ratio is within 1:3–3:1), `quality` (`low`/`medium`/`high`/`auto`), `background` (`auto`/`opaque`/`transparent`), `output_format` (`png`/`jpeg`/`webp`), `output_compression` (0–100, JPEG).
- **Pricing note** — premium tier; use `quality: low/medium` for drafts and `high` for final assets.
- **Transparent caveat** — on some hosts (e.g. Cloudflare) `gpt-image-2` does not expose transparent backgrounds; use `gpt-image-1.5` when you need a transparent PNG.

## Nano Banana (`gemini-2.5-flash-image`, Google Gemini)

Google's fast native image model, plus newer variants:

| Brand | Model id | Notes |
|-------|----------|-------|
| Nano Banana | `gemini-2.5-flash-image` | GA, fast, good free tier |
| Nano Banana 2 | `gemini-3.1-flash-image(-preview)` | Flash-speed quality, up to 4K |
| Nano Banana Pro | `gemini-3-pro-image(-preview)` | Highest quality, advanced reasoning, 4K |

- **Endpoint** — `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` with `x-goog-api-key` header or `?key=` query param.
- **Request** — `generationConfig.response_modalities: ["IMAGE"]`, and `generationConfig.imageConfig.aspectRatio`: `1:1` (default), `16:9`, `9:16`, `4:3`, `3:4`, `2:3`, `3:2`, `21:9` (note: REST uses camelCase — `imageConfig.aspectRatio`, not `aspect_ratio`).
- **Editing** — pass the image as an `inline_data` part before the text part; great for conversational multi-turn edits ("make the sky purple", "now add birds").
- **Response** — `candidates[0].content.parts[].inlineData.data` (base64) or `fileData.fileUri`.
- **Free tier** — key from Google AI Studio; SynthID watermarking is applied automatically.
- **OpenAI-compatible route** — aggregators expose it as `google/gemini-2.5-flash-image` on `/v1/images/generations`.

## SiliconFlow Qwen-Image (`Qwen/Qwen-Image`, SiliconFlow)

Alibaba's 20B MMDiT open model hosted on SiliconFlow with an OpenAI-compatible API. The cheapest option in the priority list.

- **Endpoint** — `POST https://api.siliconflow.cn/v1/images/generations`, `Authorization: Bearer <key>`.
- **Model ids** — `Qwen/Qwen-Image` (generation), `Qwen/Qwen-Image-Edit-2509` (editing, `image` field), `Tongyi-MAI/Z-Image-Turbo` (fast generation).
- **Recommended sizes** — `1328x1328` (1:1), `1664x928` (16:9), `928x1664` (9:16), `1472x1140` (4:3), `1140x1472` (3:4), `1584x1056` (3:2), `1056x1584` (2:3).
- **Parameters** — `image_size`, `num_inference_steps` (default 20, range 1–100), `seed`, `negative_prompt`, `batch_size` (Kolors only).
- **Pricing** — ~$0.042/image; strong Chinese and English text rendering.
- **Response** — `images[].url`; the URL expires after one hour, so download it immediately.

## OpenAI GPT Image (`gpt-image-1`, OpenAI)

The previous-generation GPT Image model — the "GPT Image" the user already knows. Still the most widely available GPT Image variant on third-party platforms.

- **Capabilities** — photorealistic images, accurate text rendering, precise instruction following; the family also includes `gpt-image-1.5` and `gpt-image-1-mini`.
- **Parameters** — `size` (`1024x1024`, `1536x1024`, `1024x1536`, `auto`), `quality` (`low`/`medium`/`high`/`auto`), `background` (`auto`/`transparent`/`opaque` — transparent requires `png`/`webp`), `output_format` (`png`/`jpeg`/`webp`), `style` (`vivid`/`natural`).
- **Editing** — `/v1/images/edits` with multipart `image` (+ optional `mask`), `prompt`, and options.
- **When to use** — when `gpt-image-2` is unavailable (region/aggregator limits) or when you need the reliably-supported transparent PNG path.

## Choosing

- **Best quality, text in image** → `gpt-image-2`
- **Fast + free, iterative edits** → Nano Banana
- **Cheap batch / Chinese text** → SiliconFlow Qwen-Image
- **Fallback / widest compatibility** → `gpt-image-1`

<!--
Source references:
- https://developers.openai.com/api/docs/guides/tools-image-generation
- https://developers.cloudflare.com/ai/models/openai/gpt-image-2/
- https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image
- https://docs.siliconflow.cn/en/api-reference/images/images-generations
- https://www.siliconflow.com/blog/qwen-image-is-here-on-siliconflow-superior-text-rendering-precise-image-editing
- https://fal.ai/learn/tools/what-is-gpt-image-2
- https://itbrief.co.uk/story/openai-launches-chatgpt-images-2-0-with-api-access
-->

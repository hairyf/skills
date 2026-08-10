---
name: core-post-processing
description: Veil post-processing pipelines — pipeline JSON syntax, stage types (blit/copy/mask/depth), priority/replace, and wiring GLSL shaders.
---

# Post-Processing Pipelines

A post pipeline is a JSON file in `assets/<modid>/pinwheel/post/<name>.json` describing an ordered list of stages. Each stage runs a shader over a framebuffer and writes into another framebuffer. Veil runs all pipelines after the level renders, in priority order.

## Minimal pipeline

`assets/<modid>/pinwheel/post/vhs.json`:

```json
{
  "stages": [
    {
      "type": "veil:blit",
      "shader": "mymod:vhs",
      "in": "minecraft:main",
      "out": "veil:post"
    }
  ]
}
```

`assets/<modid>/pinwheel/shaders/program/vhs.json`:

```json
{
  "vertex": "veil:blit_screen",
  "fragment": "mymod:vhs"
}
```

`assets/<modid>/pinwheel/shaders/program/vhs.fsh`:

```glsl
uniform sampler2D DiffuseSampler0;
uniform float VeilRenderTime;

in vec2 texCoord;
out vec4 fragColor;

void main() {
    vec4 color = texture(DiffuseSampler0, texCoord);
    color.rgb += vec3(sin(VeilRenderTime * 20.0) * 0.02);
    fragColor = color;
}
```

That's it — no Java required unless you set uniforms.

## Pipeline JSON fields

| Field | Meaning |
|-------|---------|
| `stages` (required) | Ordered list of stage objects |
| `textures` | Extra global textures available to all child shaders |
| `framebuffers` | Temporary per-pipeline framebuffers |
| `dynamicBuffers` | Enable deferred buffers (`albedo`, `normal`, `light_uv`, `light_color`, `debug`) |
| `renderStage` | Which `VeilRenderLevelStageEvent.Stage` the pipeline runs at |
| `priority` | Merge order; lower runs first (default 1000) |
| `replace` | `true` overwrites same-named pipelines with higher priority |

## Stage types

### Blit — draw a fullscreen quad with a shader

```json
{
  "type": "veil:blit",
  "shader": "mymod:effect",
  "in": "minecraft:main",
  "out": "veil:post",
  "clear": true
}
```

### Copy — copy buffers between framebuffers (no shader)

```json
{
  "type": "veil:copy",
  "in": "minecraft:main",
  "out": "mymod:work",
  "color": true,
  "depth": false,
  "linear": false
}
```

### Mask — control color/depth writes for later stages

```json
{
  "type": "veil:mask",
  "red": true,
  "green": true,
  "blue": true,
  "alpha": true,
  "depth": false
}
```

### Depth function

```json
{ "type": "veil:depth_function", "function": "ALWAYS" }
```

## Framebuffer references

- Global buffers are referenced by full id: `"minecraft:main"`, `"veil:post"`.
- Temporary buffers declared in the pipeline JSON are referenced by bare name: `"work"`.
- The stage `in` buffer's color attachments are exposed to the shader as `DiffuseSampler0`, `DiffuseSampler1`, ... and depth as `DiffuseDepthSampler`. Custom-attachment `name` aliases are also bound as uniforms.
- **The final stage should write to `veil:post`** so the result is composited to the screen.

## Multi-stage example (downscale → effect → upscale)

```json
{
  "framebuffers": {
    "half": { "width": "q.screen_width / 2", "height": "q.screen_height / 2" }
  },
  "stages": [
    { "type": "veil:copy", "in": "minecraft:main", "out": "half" },
    { "type": "veil:blit", "shader": "mymod:blur", "in": "half", "out": "veil:post" }
  ]
}
```

## Key points

- Pipelines with the same id merge by `priority`; `replace` opts out of merging.
- You can extend an existing pipeline by shipping a JSON with the same location/id (injection-friendly).
- Post effects run client-side on the render thread; keep them cheap (one or two fullscreen passes).

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/PostProcessing
- https://github.com/FoundryMC/Veil/wiki/Framebuffer
-->

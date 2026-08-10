---
name: features-effects
description: Recipes for VHS / CRT / scanlines / noise / chromatic-aberration post effects with Veil.
---

# Effects (VHS / CRT / noise / aberration)

All effects follow the same shape: a fragment shader + program JSON in `shaders/program/`, and a pipeline in `post/` that blits the scene through it.

## File set for a "vhs" effect

```text
assets/<modid>/pinwheel/
├── post/vhs.json
└── shaders/program/
    ├── vhs.json
    └── vhs.fsh
```

`shaders/program/vhs.json`:

```json
{ "vertex": "veil:blit_screen", "fragment": "modid:vhs" }
```

`shaders/program/vhs.fsh`:

```glsl
uniform sampler2D DiffuseSampler0;
uniform float VeilRenderTime;
uniform float Time;            // set from Java, 0..1 loop
uniform float Aberration;      // chromatic aberration strength
uniform float ScanlineDensity; // scanlines per screen height

in vec2 texCoord;

out vec4 fragColor;

// cheap hash noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
    vec2 uv = texCoord;

    // 1. chromatic aberration: sample R/B channels with horizontal offsets
    vec3 col;
    col.r = texture(DiffuseSampler0, uv + vec2(Aberration, 0.0)).r;
    col.g = texture(DiffuseSampler0, uv).g;
    col.b = texture(DiffuseSampler0, uv - vec2(Aberration, 0.0)).b;

    // 2. scanlines
    float line = sin(uv.y * ScreenSize.y * ScanlineDensity);
    col *= 0.92 + 0.08 * line;

    // 3. film grain (animated)
    col += (hash(uv * 128.0 + floor(VeilRenderTime * 24.0)) - 0.5) * 0.08;

    // 4. vignette
    float d = distance(uv, vec2(0.5));
    col *= smoothstep(0.9, 0.35, d);

    // 5. VHS color grade + mild flicker
    col = pow(col, vec3(1.1));
    col *= 0.95 + 0.05 * sin(VeilRenderTime * 30.0);

    fragColor = vec4(col, 1.0);
}
```

## Wiring uniforms from Java (Fabric)

```java
private static final Identifier VHS_PIPELINE = new Identifier("veil", "vhs");

// in ClientModInitializer.onInitializeClient()
FabricVeilPostProcessingEvent.PRE.register((name, pipeline, context) -> {
    if (name.equals(VHS_PIPELINE)) {
        pipeline.setFloat("Time", (System.currentTimeMillis() % 2000) / 2000F);
        pipeline.setFloat("Aberration", 0.002F);
        pipeline.setFloat("ScanlineDensity", 4.0F);
    }
});
```

Note: `ScreenSize` is a Veil/vanilla built-in uniform; custom uniforms (`Time`, `Aberration`, ...) must be set from Java or they won't exist.

## Variations

- **Static / glitch**: mix in a random horizontal slice offset — `uv.x += step(0.995, hash(vec2(floor(VeilRenderTime * 24.0), 7.0))) * (hash(uv.yy) - 0.5) * 0.05;`
- **Noise texture**: bind a grayscale noise PNG via the program JSON `textures` map instead of procedural `hash`.
- **CRT curvature**: bend `uv` with `uv = (uv - 0.5) * (1.0 + 0.05 * dot(uv - 0.5, uv - 0.5)) + 0.5;`
- **Fog / depth effects**: sample `DiffuseDepthSampler` and use `screenToLocalSpace()` from `#include veil:space_helper` (see Veil's built-in fog shader).

<!--
Source references:
- https://github.com/FoundryMC/Veil/wiki/PostProcessing
- https://github.com/FoundryMC/Veil/wiki/Shader
-->

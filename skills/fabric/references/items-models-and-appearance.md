---
name: fabric-item-models-and-appearance
description: Item model JSON structure and dynamic item tint sources.
---

# Item Models & Appearance

## Item Model Structure

```json
{
  "parent": "item/generated",
  "display": {
    "thirdperson_righthand": { "rotation": [0, 0, 0], "translation": [0, 0, 0], "scale": [1, 1, 1] }
  },
  "textures": { "layer0": "example-mod:item/foo", "particle": "example-mod:item/foo" },
  "gui_light": "front",
  "elements": [ { "from": [0,0,0], "to": [16,16,16], "faces": { "north": { "texture": "#layer0" } } } ]
}
```

- `parent`: `item/generated` (flat icon) or `builtin/generated` (no transforms); custom parents inherit and override.
- `display` positions: `firstperson_righthand`, `firstperson_lefthand`, `thirdperson_righthand`, `thirdperson_lefthand`, `gui`, `head`, `ground`, `fixed`. Translation must stay in [-80, 80]; scale max 4.
- `textures`: up to 3 `layerN` entries (only with `item/generated`), `particle`, and custom variables referenced as `#name`.
- `elements`: cuboids from `[x,y,z]` to `[x,y,z]` (range -16..32), optional rotation (`axis` x/y/z, angle -45..45 in 22.5° steps, `rescale`), `shade`, `light_emission` (0–15), and per-face `uv`, `texture`, `cullface`, `rotation` (90° increments), `tintindex`.

## Dynamic Item Tinting (Tint Sources)

Create a custom `ItemTintSource` (record/class) with a `MapCodec` and a `calculate` method:

```java
public record RainTintSource(int color) implements ItemTintSource {
    public static final MapCodec<RainTintSource> CODEC = ExtraCodecs.RGB_COLOR_CODEC
        .xmap(RainTintSource::new, RainTintSource::color)
        .fieldOf("rain_color");

    @Override
    public Type<? extends ItemTintSource> type() { return TYPE; }

    @Override
    public int calculate(int fallbackColor, ItemRenderState renderState) {
        boolean raining = Minecraft.getInstance().level != null && Minecraft.getInstance().level.isRaining();
        return raining ? color : fallbackColor;
    }
}
```

Register in the client initializer: `ItemTintSources.ID_MAPPER.register(identifier, RainTintSource.CODEC)`, then reference it in the client item JSON:

```json
{ "model": { "type": "minecraft:model", "model": "example-mod:item/waxcap" }, "tint_source": { "type": "example-mod:rain", "rain_color": 0x0000FF } }
```

Use grayscale textures plus tint sources (like vanilla leaves) so the color can change via resource packs.

<!--
Source references:
- https://docs.fabricmc.net/develop/items/item-models
- https://docs.fabricmc.net/develop/items/item-appearance
-->

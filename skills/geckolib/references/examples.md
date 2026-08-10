---
name: geckolib-examples
description: Official GeckoLib example mods by feature, plus a real-world mod using GeckoLib.
---

# GeckoLib Examples

The official examples repository (`https://github.com/bernie-g/geckolib-examples`, branch `Multiloader-26.1`) contains working implementations for every major feature.

## By object type

- **Entities** (8 examples): Bat (conditional controllers + glowmasks + bone particles), Vehicle/Bike (Molang queries), CoolKid (GeoRenderLayers + inline DefaultedEntityGeoModel), Mutant Zombie (held-item rendering + custom bone textures), Fake Glass (existing textures as bone textures), Parasite (attack animations + multiple controllers), Race Car (animated textures), Replaced Creeper (replaced entity rendering)
- **Items**: Jack-in-the-Box (item rendering + triggerable animations)
- **Blocks**: Gecko Habitat & Fertilizer (time-of-day DataTickets in animation state)
- **Armor**: Gecko Armor (armor rendering + DataTickets + glowmasks), Wolf Armor (armor rendering + DataTickets)

## By feature

| Feature | Example |
|---|---|
| Basic controller setup | Bat entity |
| Attack animations / multiple controllers | Parasite entity |
| GeoRenderLayer usage | CoolKid entity |
| Triggerable animations | Jack-in-the-Box item |
| DataTickets in animations | Gecko Habitat / Fertilizer blocks |
| Custom bone texturing | Fake Glass entity |
| Held item rendering | Mutant Zombie entity |
| Animated textures | Race Car entity |
| Replaced entity rendering | Replaced Creeper entity |

## Copy-paste templates

The wiki ships ready-to-copy classes for every object type:

- [Entity templates](https://wiki.geckolib.com/docs/geckolib5/entities/copy-paste-templates)
- [Block templates](https://wiki.geckolib.com/docs/geckolib5/blocks/copy-paste-templates)
- [Item templates](https://wiki.geckolib.com/docs/geckolib5/items/copy-paste-templates)
- [Armor templates](https://wiki.geckolib.com/docs/geckolib5/armor/copy-paste-templates)
- [Replaced entity templates](https://wiki.geckolib.com/docs/geckolib5/entities/replaced-entities/copy-paste-templates)

## Real-world mod

[MinecraftFoundFootage](https://github.com/SpacePotatoee/MinecraftFoundFootage) (by SpacePotatoee) is a found-footage horror mod that uses GeckoLib with custom per-bone manipulation (IK/leg chains via `GeoBone` access, `DynamicGeoEntityRenderer`, `addRenderLayer`, and `renderRecursively` overrides). Note that it targets the **GeckoLib 4-era API** (`software.bernie.geckolib` imports, mutable `GeoBone`s) — under GeckoLib 5 the same effect is achieved with `BoneSnapshots`/`BoneUpdaters` and `CustomBoneTextureGeoLayer`; see [Updating From GeckoLib 4](updating-from-v4.md).

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/examples/intro
- https://wiki.geckolib.com/docs/geckolib5/examples/entities
- https://wiki.geckolib.com/docs/geckolib5/examples/items
- https://wiki.geckolib.com/docs/geckolib5/examples/blocks
- https://wiki.geckolib.com/docs/geckolib5/examples/armor
- https://github.com/SpacePotatoee/MinecraftFoundFootage
-->

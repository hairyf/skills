---
name: best-practices
description: GeckoLib 4.x vs 3.x differences, common crashes, animation replay, and server sync.
---

# Best Practices

## 4.x vs 3.x

| | 3.x | 4.x |
|---|---|---|
| Package | `software.bernie.geckolib3` | `software.bernie.geckolib` |
| Renderer base | `GeoRenderer` / `AnimatedGeoRenderer` | `GeoEntityRenderer<T>` / `GeoItemRenderer<T>` / ... |
| Triggers | client-side only | server-side `triggerAnim` supported |
| Registration | verbose | `Defaulted*GeoModel` + one-line registration |

Never mix imports from both packages.

## Common crashes & fixes

| Symptom | Fix |
|---------|-----|
| `NPE: ... entityrenderer is null` on spawn | renderer not registered client-side — add `EntityRendererRegistry.register(...)` |
| Attack animation plays only partway | swing duration too short — override `getCurrentSwingDuration()` in the entity |
| Animation won't replay | call `state.resetCurrentAnimation()` when the condition ends, or the JSON loop type is `hold_on_last_frame` |
| Model shows missing texture | `GeoModel` paths don't match files under `geo/`/`textures/`/`animations/` |
| Animation plays but nothing moves | animation names in `RawAnimation` don't match the JSON |
| Server crash / classloading error | client model/renderer classes reached from the common entrypoint |

## Animation state handler rules

- The handler runs **every frame** — treat it as a state query, not an event.
- Use `setAndContinue(...)` for looping/state animations, `PlayState.STOP` to idle.
- For one-shot actions prefer `triggerableAnim(...)` + `triggerAnim(...)` over state-machine hacks.

## Controller ordering & layering

- Register walk/idle controllers before attack/use controllers; later controllers override earlier ones, so an attack can swing an arm while the walk loop continues underneath.
- Give controllers unique names; `triggerAnim("controller", "trigger")` targets by name.

## Server sync

- `triggerAnim` works from the server for entities (4.x networking built-in).
- For items/armor (singleton animatables), call `SingletonGeoAnimatable.registerSyncedAnimatable(this)` in the constructor and pass `GeoItem.getOrAssignId(stack, serverWorld)` when triggering.

## Version notes

- 1.20.1 → GeckoLib `4.4.9`; newer `4.5+` targets 1.20.6+. Check `geckolib-fabric-1.20.1` maven-metadata for the exact range.
- Wiki code uses Mojmap (`Level`, `EntityRendererProvider.Context`, `ResourceLocation`); translate to Yarn on Fabric (`World`, `EntityRendererFactory.Context`, `Identifier`).

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-4-Changes
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Entities-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Triggerable-Animations-(Geckolib4)
-->

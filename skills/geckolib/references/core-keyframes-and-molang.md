---
name: geckolib-keyframes-and-molang
description: AnimationPoint/AnimationTimeline internals and Molang expressions — operators, math functions, queries, and custom functions.
---

# Keyframes & Molang

## AnimationPoint & AnimationTimeline

- `AnimationTimeline` is created by a controller when it starts a `RawAnimation`; it represents the whole animation including transition periods into/out of/between stages — the "track" the animation plays along.
- Each render pass, the controller advances its current time and asks the timeline for an `AnimationPoint`: a snapshot of the keyframes and interpolation in use at that moment.
- The controller submits the `AnimationPoint` to the static `AnimationProcessor`, which produces the `BoneSnapshot`s used to animate bones.

You normally never interact with these directly — they are internal plumbing.

## Molang

Molang lets you write mathematical expressions directly in animation keyframe values in Blockbench. Values are evaluated dynamically using functions and live queries:

```
math.cos(query.anim_time)
```

Example from the wiki: `((-0.2 + 1.5 * (math.abs(math.mod(query.ground_speed, 13) - 6.5) - 3.25) / 3.25) * query.ground_speed) * 57.3`

GeckoLib's Molang is close to Bedrock's but not identical — some queries/functions differ. Full reference: [Microsoft Molang docs](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/molangreference/examples/molangconcepts/molangintroduction).

### Operators

`+ - * / % ^ && || ! < <= > >= == != = ?: () ;` — arithmetic, logic, comparison, variable assignment, ternary, brackets, and `;` to chain multiple expressions (returns the final value).

### Functions

`math.abs`, `acos`, `asin`, `atan`, `atan2(y,x)`, `ceil`, `clamp(value,min,max)`, `cos`, `die_roll`, `die_roll_integer`, `exp`, `floor`, `hermite_blend`, `lerp(min,max,delta)`, `lerprotate`, `ln`, `max`, `min`, `mod`, `pi`, `pow`, `random`, `random_integer`, `round`, `sin`, `sqrt`, `to_deg`, `to_rad`, `trunc`. Trig functions take degrees.

### Queries (live values)

Commonly used:

| Query | Meaning |
|---|---|
| `query.anim_time` | Seconds the current animation has been playing |
| `query.frame_alpha` | Partial tick (0–1) |
| `query.controller_speed` | Current controller speed multiplier |
| `query.life_time` | Seconds the animatable has been rendering |
| `query.is_moving`, `query.ground_speed`, `query.vertical_speed`, `query.yaw_speed` | Movement state |
| `query.is_on_ground`, `query.is_in_water`, `query.is_on_fire`, `query.is_sneaking`, `query.is_sprinting`, `query.is_swimming` | World-state booleans |
| `query.head_y_rotation`, `query.body_y_rotation`, `query.limb_swing`, `query.limb_swing_amount` | Vanilla animation data |
| `query.health`, `query.max_health`, `query.hurt_time`, `query.death_ticks` | Entity stats |
| `query.is_baby`, `query.has_owner`, `query.is_angry`, `query.is_leashed`, `query.is_saddled` | Entity relationships |
| `query.cardinal_facing`, `query.movement_direction` | Direction ordinals (0=Down…5=East) |
| `query.block_state` | Current blockstate variant index (BlockEntity only) |
| `query.is_enchanted`, `query.max_durability`, `query.remaining_durability`, `query.item_max_use_duration` | Item queries |
| `query.time_of_day`, `query.day`, `query.moon_phase`, `query.moon_brightness`, `query.player_level`, `query.distance_from_camera` | World/player queries |

Some queries are type-specific; using an incompatible query returns `0` and logs an error.

### Custom functions & variables

- Register custom Molang functions via `MathParser#registerFunction` — **must** be done in your mod constructor.
- Use `=` to assign your own variables inside expressions (e.g. `variable.foo = 1; variable.foo * 2`).

## Custom easing & loop types

Register custom animation easings and loop types at runtime:

```java
// Custom easing from a 0->1 curve function
GeckoLibUtil.addCustomSimpleEasingType("my_easing", (input) -> input * input);

// Register a custom LoopType / EasingType instance under a name
GeckoLibUtil.addCustomLoopType("my_loop", myCustomLoopType);
GeckoLibUtil.addCustomEasingType("my_easing", myCustomEasingType);
```

Custom easings then work as keyframe easing types in Blockbench exports and in `setOverrideEasingType`.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/concepts/animation/animationpoint
- https://wiki.geckolib.com/docs/geckolib5/concepts/animation/animationtimeline
- https://wiki.geckolib.com/docs/geckolib5/concepts/animation/molang
- https://wiki.geckolib.com/docs/geckolib5/updating/noteworthy/molang-variables
-->

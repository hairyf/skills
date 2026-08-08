---
name: geckolib-v4-molang
description: GeckoLib 4 Molang — operators, math functions, the full query list, custom functions and queries, compound expressions, and variables.
---

# GeckoLib 4 Molang

Molang is the expression language used in `.animation.json` keyframe values. GeckoLib's implementation follows Minecraft Bedrock's but is not identical — some functions/queries differ or are missing.

## Operators

`+ - * / %` arithmetic, `^` exponent, `&& || !` logic, `< <= > >= == !=` comparisons, `=` variable assignment, `? :` ternary, `()` grouping, `;` compound-expression separator.

## Functions

| Function | Description |
|---|---|
| `math.abs(x)` | Absolute value |
| `math.acos/asin/atan(x)` | Inverse trig, degrees in, radians out |
| `math.atan2(y,x)` | Arc-tangent theta, output in degrees |
| `math.ceil/floor/round/trunc(x)` | Rounding |
| `math.clamp(v,min,max)` | Clamp |
| `math.cos/sin(x)` | Trig, input degrees |
| `math.die_roll(n,min,max[,seed])` | Sum of n random values in range |
| `math.die_roll_integer(...)` | Integer variant |
| `math.exp(x)`, `math.ln(x)`, `math.pow(a,b)`, `math.sqrt(x)` | Exponentials/logs |
| `math.hermite_blend(x)` | Hermite interpolation curve |
| `math.lerp(min,max,delta)` | Linear interpolation |
| `math.lerprotate(min,max,delta)` | Lerp wrapping degrees |
| `math.max(a,b)`, `math.min(a,b)` | Min/max |
| `math.mod(a,b)` | Modulus |
| `math.pi` | π |
| `math.random(a[,b][,seed])`, `math.random_integer(...)` | Random values |
| `math.to_deg(x)`, `math.to_rad(x)` | Unit conversion |

## Queries

| Query | Applies to | Description |
|---|---|---|
| `query.actor_count` | Global | Rendered entities in last render pass |
| `query.anim_time` | Any | Seconds the current animation has run |
| `query.blocking` | LivingEntity | 1 if blocking |
| `query.block_state` | BlockEntity | Current blockstate variant index |
| `query.body_x_rotation` / `body_y_rotation` | Entity | Body pitch / yaw |
| `query.can_climb` / `can_fly` / `can_swim` / `can_walk` | Mob | Navigation capabilities |
| `query.cardinal_facing` | Entity | Facing ordinal (0=Down..5=East) |
| `query.cardinal_facing_2d` | Entity | Lateral facing ordinal |
| `query.cardinal_player_facing` | Global | Client player facing ordinal |
| `query.day` | Global | World day |
| `query.death_ticks` | LivingEntity | Ticks dead |
| `query.distance_from_camera` | Entity | Distance in blocks to camera |
| `query.equipment_count` | LivingEntity | Worn item count |
| `query.frame_alpha` | Any | Partial tick fraction |
| `query.get_actor_info_id` | Entity | Numeric entity id |
| `query.ground_speed` | LivingEntity | Lateral speed (blocks/tick) |
| `query.has_cape` | Global | Client player has cape |
| `query.has_collision` | Entity | Noclip status |
| `query.has_gravity` | Entity | Gravity enabled |
| `query.has_head_gear` | LivingEntity | Head slot occupied |
| `query.has_owner` | Entity | OwnableEntity has owner |
| `query.has_player_rider` / `has_rider` | Entity | Passenger checks |
| `query.head_x_rotation` / `head_y_rotation` | LivingEntity | Lerped head pitch / yaw |
| `query.health` / `max_health` | LivingEntity | Health values |
| `query.hurt_time` | LivingEntity | Hurt overlay ticks |
| `query.invulnerable_ticks` | LivingEntity | Remaining invulnerability |
| `query.is_alive` | Entity | Alive |
| `query.is_angry` | Entity | NeutralMob angry |
| `query.is_baby` | LivingEntity | Baby |
| `query.is_breathing` | Entity | Full air |
| `query.is_enchanted` / `is_stackable` | Item | ItemStack flags |
| `query.is_fire_immune` | Entity | Fire immunity |
| `query.is_first_person` | Global | Client perspective |
| `query.is_invisible` | Entity | Invisible |
| `query.is_in_contact_with_water` / `is_in_lava` / `is_in_water` / `is_in_water_or_rain` | Entity | Fluid checks |
| `query.is_leashed` | Entity | Leashed |
| `query.is_moving` | Entity | Moving |
| `query.is_on_fire` / `is_on_ground` | Entity | State flags |
| `query.is_powered` | Entity | PowerableMob powered |
| `query.is_riding` | Entity | Is a passenger |
| `query.is_saddled` | Entity | Saddleable saddled |
| `query.is_silent` | Entity | Silent |
| `query.is_sleeping` | LivingEntity | Sleeping |
| `query.is_sneaking` / `is_sprinting` / `is_swimming` | Entity | Movement states |
| `query.is_using_item` | LivingEntity | Using an item |
| `query.is_wall_climbing` | LivingEntity | On climbable |
| `query.item_max_use_duration` | Item | Max use ticks |
| `query.life_time` | Any | Seconds animatable has been rendering |
| `query.main_hand_item_max_duration` / `main_hand_item_use_duration` | LivingEntity | Item use timings |
| `query.max_durability` / `remaining_durability` | Item | Durability |
| `query.moon_brightness` / `moon_phase` | Global | Moon values |
| `query.movement_direction` | Entity | Velocity direction ordinal |
| `query.player_level` | Global | Client XP level |
| `query.rider_body_x_rotation` / `rider_body_y_rotation` / `rider_head_x_rotation` / `rider_head_y_rotation` | Entity | Passenger rotations |
| `query.scale` | LivingEntity | Scale attribute |
| `query.sleep_rotation` | LivingEntity | Bed yaw |
| `query.time_of_day` | Global | Day fraction 0..1 |
| `query.time_stamp` | Global | Total world ticks |
| `query.vertical_speed` | Entity | Vertical velocity |
| `query.yaw_speed` | Entity | Yaw delta |

Queries only work on compatible animatable types; using one on the wrong type returns 0 and logs an error.

## Custom functions

Custom functions are `com.eliotlash.mclib.math.functions.Function` subclasses registered in the parser's `functions` map at mod construction (GeckoLib 4.4.9 does not have the later `MathParser#registerFunction` helper — that arrived with 4.5):

```java
public class MyBounceFunction extends Function {
    public MyBounceFunction(IValue[] values, String name) throws Exception {
        super(values, name);
    }

    @Override
    public int getRequiredArguments() { return 1; }

    @Override
    public double compute() {
        return Math.abs(this.getArg(0));
    }
}

// mod constructor
MolangParser.INSTANCE.functions.put("math.mymod_bounce", MyBounceFunction.class);
```

## Custom queries

Register the query as a `LazyVariable` at mod construction, then supply its value in `GeoModel#applyMolangQueries`:

```java
// mod constructor
MolangParser.INSTANCE.register(new LazyVariable("query.mymod_bouncing", 0));
```

```java
// in GeoModel#applyMolangQueries(T animatable, double animTime)
MolangParser.INSTANCE.setValue("query.mymod_bouncing", () -> animatable.getBouncing());
```

`LazyVariable` also accepts a `DoubleSupplier` at construction, and `setMemoizedValue` caches the value per frame. (The `MolangQueries#setActorVariable` helper is 4.5+ and does not exist in 4.4.9.)

Name custom queries with your modid (`query.mymod_...`) to avoid clashes.

## Compound expressions & variables

Split expressions with `;` — each evaluates in order, the last value is returned:

```
v.is_walking = 1; math.sin(query.anim_time)
```

Variables are **global** in GeckoLib — shared across all animatables using the same name. Use unique names or only rely on them within the same frame pass.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Molang-(Geckolib4)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->

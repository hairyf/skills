---
name: fabric-resource-conditions-and-statistics
description: Conditional resource loading and custom player statistics.
---

# Resource Conditions & Statistics

## Resource Conditions

Fabric API conditions gate whether a resource (recipe, advancement, loot table, predicate, item modifier) loads — useful for cross-mod integrations.

In JSON, add `"fabric:load_conditions": [...]` at the root:

```json
{
  "type": "minecraft:crafting_shaped",
  "fabric:load_conditions": [
    { "condition": "fabric:all_mods_loaded", "values": ["another-mod"] },
    { "condition": "fabric:tags_populated", "registry": "minecraft:item", "values": ["example-mod:smelly_items"] }
  ]
}
```

Built-in conditions: boolean ops `fabric:true`, `fabric:false`, `fabric:not` (`value`), `fabric:or`/`fabric:and` (`values`); mod checks `fabric:all_mods_loaded` / `fabric:any_mods_loaded`; `fabric:tags_populated` (registry + `values`); `fabric:features_enabled` (feature flags); `fabric:registry_contains` (`values` ids).

Custom conditions: a record holding values + `MapCodec` + `test(...)` method, registered via a helper mirroring `DefaultResourceConditionTypes` (register in `onInitialize`). Datagen: `withConditions(...)` on advancement/loot/recipe outputs.

## Statistics

Custom stats track player actions:

```java
public class ModStats {
    public static final Identifier FRIENDSHIPS = Identifier.fromNamespaceAndPath("example-mod", "friendships");

    public static void register() {
        Registry.register(BuiltInRegistries.CUSTOM_STAT, FRIENDSHIPS, FRIENDSHIPS);
        Stats.CUSTOM.get(FRIENDSHIPS, StatFormatter.DEFAULT);
    }
}
```

Formatters: `DEFAULT` (raw), `DIVIDE_BY_TEN`, `DISTANCE` (cm/m/km), `TIME` (s/min/h/day). Use `Player#awardStat(stat, amount)` / `awardStat(stat)` / `resetStat(stat)`.

<!--
Source references:
- https://docs.fabricmc.net/develop/resource-conditions
- https://docs.fabricmc.net/develop/statistics
-->

---
name: fabric-first-entity
description: Registering entities, goals, models, renderers, animations, synced data and NBT.
---

# Creating Your First Entity

## Entity Class & Registration

Create the entity class (e.g. extends `PathfinderMob`), register the type with size and attributes:

```java
public static final EntityType<MiniGolemEntity> MINI_GOLEM = Registry.register(
    BuiltInRegistries.ENTITY_TYPE,
    Identifier.fromNamespaceAndPath("example-mod", "mini_golem"),
    EntityType.Builder.of(MiniGolemEntity::new, MobCategory.CREATURE)
        .sized(0.75f, 1.0f)
        .build()
);

public static void registerAttributes() {
    Attributes.register(MINI_GOLEM, MiniGolemEntity::createAttributes);
}
```

`createAttributes()` returns `Mob.createMobAttributes().add(Attributes.MAX_HEALTH, 20).add(Attributes.MOVEMENT_SPEED, 0.25)`.

## Goals

Override `registerGoals` with prioritized `Goal`s (lower priority value = higher priority): `TemptGoal`, `RandomStrollGoal`, `LookAtPlayerGoal`, `RandomLookAroundGoal`, etc.

## Rendering (client)

1. `EntityRenderState` subclass — data extracted for rendering (position, animation states).
2. `EntityModel` subclass — body parts as cuboids via `CubeListBuilder` + `LayerDefinition.create(modelData, 64, 32)`. Higher Y in models = bottom of the entity (inverted vs world). Blockbench is the standard tool for models; pick the correct mapping (Mojang for 26.x).
3. `ModelLayerLocation` registered through `ModelLayerRegistry` (client).
4. `EntityRenderer` subclass — `getTextureLocation`, shadow radius, and hooks up model/state; registered via `EntityRenderers.register(type, rendererProvider)` in the client initializer.
5. Walking animation in the model's setup method using `cos` on `limbSwing * 0.2f` scaled by `limbSwingAmount` and `Mth.PI` phase offset between legs.

## Synced Data

Use `EntityDataAccessor` + `EntityDataSerializers` for data needed on clients:

```java
private static final EntityDataAccessor<Boolean> DANCING = SynchedEntityData.defineId(
    MiniGolemEntity.class, EntityDataSerializers.BOOLEAN);
```

Override `onSyncedDataUpdated` to react. Persistent data goes in `addAdditionalSaveData` / `readAdditionalSaveData` (NBT).

## Animations

Define `AnimationDefinition`s (`withLength`, `looping`, `addAnimation` keyframes with linear or Catmull-Rom interpolation), copy the `AnimationState` into the render state, and apply it in the model's setup method.

Spawn with `/summon example-mod:mini_golem`; add a spawn egg per `items-spawn-egg`.

<!--
Source references:
- https://docs.fabricmc.net/develop/entities/first-entity
-->

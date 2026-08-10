---
name: features-entities
description: Full GeckoLib 4.x custom-entity walkthrough for Fabric (Yarn) — class, model, renderer, registration, animation JSON, server triggers.
---

# Custom Animated Entity

## 1. Entity class (implements `GeoEntity`)

```java
package com.mymod.entity;

import net.minecraft.entity.EntityType;
import net.minecraft.entity.mob.PathAwareEntity;
import net.minecraft.world.World;
import software.bernie.geckolib.animatable.GeoEntity;
import software.bernie.geckolib.animation.*;
import software.bernie.geckolib.constant.DefaultAnimations;
import software.bernie.geckolib.util.AnimatableInstanceCache;
import software.bernie.geckolib.util.GeckoLibUtil;

public class SkinwalkerEntity extends PathAwareEntity implements GeoEntity {
    private static final RawAnimation IDLE = RawAnimation.begin().thenLoop("misc.idle");
    private static final RawAnimation WALK = RawAnimation.begin().thenLoop("move.walk");
    private static final RawAnimation ATTACK = RawAnimation.begin().thenPlay("attack.swing");

    private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);

    public SkinwalkerEntity(EntityType<? extends SkinwalkerEntity> type, World world) {
        super(type, world);
    }

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(new AnimationController<>(this, "move", 5, state ->
            state.isMoving() ? state.setAndContinue(WALK) : state.setAndContinue(IDLE)));

        controllers.add(new AnimationController<>(this, "attack", 0, state -> {
            if (this.handSwinging)
                return state.setAndContinue(ATTACK);
            state.resetCurrentAnimation();
            return PlayState.STOP;
        }).triggerableAnim("attack", ATTACK));
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.cache;
    }
}
```

## 2. Model

```java
package com.mymod.client.model;

import net.minecraft.util.Identifier;
import software.bernie.geckolib.model.GeoModel;
import com.mymod.entity.SkinwalkerEntity;

public class SkinwalkerModel extends GeoModel<SkinwalkerEntity> {
    private static final Identifier MODEL = new Identifier("mymod", "geo/entity/skinwalker.geo.json");
    private static final Identifier TEXTURE = new Identifier("mymod", "textures/entity/skinwalker.png");
    private static final Identifier ANIMATION = new Identifier("mymod", "animations/entity/skinwalker.animation.json");

    @Override public Identifier getModelLocation(SkinwalkerEntity animatable) { return MODEL; }
    @Override public Identifier getTextureLocation(SkinwalkerEntity animatable) { return TEXTURE; }
    @Override public Identifier getAnimationFileLocation(SkinwalkerEntity animatable) { return ANIMATION; }
}
```

Or simply `new DefaultedEntityGeoModel<>(new Identifier("mymod", "skinwalker"))` with matching paths.

## 3. Renderer

```java
package com.mymod.client.renderer;

import com.mymod.client.model.SkinwalkerModel;
import com.mymod.entity.SkinwalkerEntity;
import net.minecraft.client.render.entity.EntityRendererFactory;
import software.bernie.geckolib.renderer.GeoEntityRenderer;

public class SkinwalkerRenderer extends GeoEntityRenderer<SkinwalkerEntity> {
    public SkinwalkerRenderer(EntityRendererFactory.Context ctx) {
        super(ctx, new SkinwalkerModel());
    }
}
```

## 4. Register entity + renderer

```java
// Common: register the EntityType as usual (Registry.register(Registries.ENTITY_TYPE, ...))
// Client entrypoint:
@Override
public void onInitializeClient() {
    EntityRendererRegistry.register(ModEntities.SKINWALKER, SkinwalkerRenderer::new);
}
```

**Missing renderer registration = NPE crash when the entity spawns.**

## 5. Animation JSON

`assets/mymod/animations/entity/skinwalker.animation.json`:

```json
{
  "format_version": "1.8.0",
  "animations": {
    "misc.idle": {
      "loop": true,
      "animation_length": 2.0,
      "bones": {
        "head": { "rotation": { "0.0": [0, 0, 0], "1.0": [5, 0, 0], "2.0": [0, 0, 0] } }
      }
    },
    "move.walk": {
      "loop": true,
      "animation_length": 1.0,
      "bones": {
        "left_leg": { "rotation": { "0.0": [0, 0, 25], "0.5": [0, 0, -25], "1.0": [0, 0, 25] } }
      }
    },
    "attack.swing": {
      "loop": false,
      "animation_length": 0.5,
      "bones": {
        "right_arm": { "rotation": { "0.0": [0, 0, 0], "0.25": [-120, 0, 0], "0.5": [0, 0, 0] } }
      }
    }
  }
}
```

## 6. Trigger from the server

```java
// Anywhere server-side (e.g. an attack goal)
if (entity instanceof GeoEntity geo)
    geo.triggerAnim("attack", "attack");
```

## Key points

- Animation names in JSON (`misc.idle`, `move.walk`, `attack.swing`) must match the `RawAnimation` strings.
- The attack controller uses `handSwinging` + `resetCurrentAnimation()` so swings replay reliably.
- Renderer/model classes are client-only (keep them out of the common entrypoint).

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Entities-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Custom-GeckoLib-Entity
-->

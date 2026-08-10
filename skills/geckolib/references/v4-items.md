---
name: geckolib-v4-items
description: GeckoLib 4 animated items — GeoItem, synced animatables, the item display JSON, renderer registration on Forge vs Fabric, and perspective-aware animations.
---

# GeckoLib 4 Items

Minecraft keeps one instance per `Item`, so animated items must map animation state per `ItemStack`. The base setup is the standard animatable pattern plus network sync and a renderer hook.

## Item class

```java
public class ExampleItem extends Item implements GeoItem {
    private static final RawAnimation ACTIVATE_ANIM = RawAnimation.begin().thenPlay("use.activate");
    private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);

    public ExampleItem(Properties properties) {
        super(properties);
        SingletonGeoAnimatable.registerSyncedAnimatable(this); // enables data syncing + server triggers
    }

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(new AnimationController<>(this, "Activation", 0, state -> PlayState.STOP)
                .triggerableAnim("activate", ACTIVATE_ANIM));
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.cache;
    }
}
```

## Item display JSON

`assets/<modid>/models/item/<item>.json` must opt into BEWLR rendering:

```json
{
  "parent": "builtin/entity"
}
```

Missing this file → black/purple cube; missing `"parent": "builtin/entity"` → invisible item.

## Renderer

```java
public class ExampleItemRenderer extends GeoItemRenderer<ExampleItem> {
    public ExampleItemRenderer() {
        super(new ExampleItemModel());
    }
}
```

### Forge (1.19.3 → 1.20.6)

```java
@Override
public void initializeClient(Consumer<IClientItemExtensions> consumer) {
    consumer.accept(new IClientItemExtensions() {
        private ExampleItemRenderer renderer;

        @Override
        public BlockEntityWithoutLevelRenderer getItemStackRenderer() {
            if (this.renderer == null)
                this.renderer = new ExampleItemRenderer();
            return this.renderer;
        }
    });
}
```

### Fabric

GeckoLib's dynamic render provider: cache `GeoItem.makeRenderer(this)` as a `Supplier<Object>`, return it from `getRenderProvider`, and create the renderer in `createRenderer`:

```java
private final Supplier<Object> renderProvider = GeoItem.makeRenderer(this);

@Override
public Supplier<Object> getRenderProvider() {
    return this.renderProvider;
}

@Override
public void createRenderer(Consumer<Object> consumer) {
    consumer.accept(new RenderProvider() {
        private ExampleItemRenderer renderer;

        @Override
        public BlockEntityWithoutLevelRenderer getCustomRenderer() {
            if (this.renderer == null)
                this.renderer = new ExampleItemRenderer();
            return this.renderer;
        }
    });
}
```

## Perspective-aware animations

Override `isPerspectiveAware()` to return `true`, then read `state.getData(DataTickets.ITEM_RENDER_PERSPECTIVE)` (`ItemDisplayContext`) in the controller to branch per perspective:

```java
@Override
public boolean isPerspectiveAware() {
    return true;
}
```

## Server-side triggers

```java
if (level instanceof ServerLevel serverLevel)
    triggerAnim(player, GeoItem.getOrAssignId(player.getItemInHand(hand), serverLevel), "Activation", "activate");
```

`GeoItem.getOrAssignId(ItemStack, ServerLevel)` gives the per-stack instance id required for syncing.

## Split sources

The renderer and the `initializeClient`/`createRenderer` hooks are client-only. In split-source setups (Fabric client source set, Forge client-only source set), keep `GeoItemRenderer` and its registration in the client source set.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Items-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Triggerable-Animations-(Geckolib4)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->

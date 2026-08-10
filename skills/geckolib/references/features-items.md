---
name: geckolib-items
description: Creating animated items — GeoItem, GeoRenderProvider, GeoItemRenderer, item JSONs, split sources, and perspective-aware animations.
---

# GeckoLib Items

Steps: create the item class → register the item → create the renderer → apply it → create the item JSON and item display JSON.

## Item class

```java
public class ExampleItem extends Item implements GeoItem {
    private final AnimatableInstanceCache geoCache = GeckoLibUtil.createInstanceCache(this);

    public ExampleItem(Properties properties) {
        super(properties);
        // GeoItem.registerSyncedAnimatable(this); // uncomment for triggered animations
    }

    @Override
    public void createGeoRenderer(Consumer<GeoRenderProvider> consumer) {
        consumer.accept(new GeoRenderProvider() {
            private final Supplier<GeoItemRenderer<ExampleItem>> renderer =
                Suppliers.memoize(() -> new GeoItemRenderer<>(ExampleItem.this));

            @Override
            public @Nullable GeoItemRenderer<ExampleItem> getGeoItemRenderer() {
                return this.renderer.get();
            }
        });
    }

    @Override
    public void registerControllers(final AnimatableManager.ControllerRegistrar controllers) {
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.geoCache;
    }
}
```

Items use a dynamic `GeoRenderProvider` (not a registered renderer) so each item instance supplies its own renderer. Always memoize the `Supplier` — never create a renderer per render pass.

## Item JSON files

Item JSON at `assets/<modid>/items/<item_id>.json` — missing this causes the black-and-purple placeholder texture:

```json
{
  "model": {
    "type": "minecraft:special",
    "base": "<modid>:item/<item_id>",
    "model": {
      "type": "geckolib:geckolib"
    }
  }
}
```

Item display JSON at `assets/<modid>/models/item/<item_id>.json`:

```json
{
  "parent": "builtin/entity",
  "textures": { "particle": "<modid>:item/<item_id>" }
}
```

## Split sources (client-server separated projects)

The renderer class lives in client sources, so the common item class can't reference it directly:

```java
public class ExampleItem extends Item implements GeoItem {
    public final MutableObject<GeoRenderProvider> geoRenderProvider = new MutableObject<>();
    // ... cache & controllers ...

    @Override
    public void createGeoRenderer(Consumer<GeoRenderProvider> consumer) {
        consumer.accept(this.geoRenderProvider.getValue());
    }
}
```

Then set the provider in client setup:

```java
// Fabric onInitializeClient / Forge-NeoForge EntityRenderersEvent.RegisterRenderers
ItemRegistry.EXAMPLE_ITEM.geoRenderProvider.setValue(new GeoRenderProvider() {
    private final Supplier<GeoItemRenderer<ExampleItem>> renderer =
        Suppliers.memoize(() -> new GeoItemRenderer<>(ItemRegistry.EXAMPLE_ITEM.get()));

    @Override
    public @Nullable GeoItemRenderer<ExampleItem> getGeoItemRenderer() {
        return this.renderer.get();
    }
});
```

## Perspective-aware animations

To play different animations in-hand vs GUI, override:

```java
@Override
public boolean isPerspectiveAware() {
    return true;
}
```

## Asset files

- Model: `assets/<mod_id>/geckolib/models/item/<item_id>.geo.json`
- Animations: `assets/<mod_id>/geckolib/animations/item/<item_id>.animation.json`
- Texture: `assets/<mod_id>/textures/item/<item_id>.png`

## Common issues

- **Black/purple square** — item JSON missing or misnamed.
- **Completely invisible item** — `GeoItemRenderer` was never applied via `createGeoRenderer`.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/items/intro
- https://wiki.geckolib.com/docs/geckolib5/items/the-item-class
- https://wiki.geckolib.com/docs/geckolib5/items/the-item-renderer
- https://wiki.geckolib.com/docs/geckolib5/items/applying-the-item-renderer
- https://wiki.geckolib.com/docs/geckolib5/items/the-item-json-files
- https://wiki.geckolib.com/docs/geckolib5/items/copy-paste-templates
-->

---
name: geckolib-armor
description: Creating animated armor — GeoArmorRenderer, GeoRenderProvider wiring, split sources, and armor model requirements.
---

# GeckoLib Armor

Armor setup is identical to items, but uses `GeoArmorRenderer` and the armor model template. Steps: create the item class → register the item → create the armor renderer → apply it.

## Item class

```java
public class ExampleArmorItem extends Item implements GeoItem {
    private final AnimatableInstanceCache geoCache = GeckoLibUtil.createInstanceCache(this);

    public ExampleArmorItem(ArmorMaterial material, ArmorType type, Properties properties) {
        super(properties.humanoidArmor(material, type));
        // GeoItem.registerSyncedAnimatable(this); // uncomment for triggered animations
    }

    @Override
    public void createGeoRenderer(Consumer<GeoRenderProvider> consumer) {
        consumer.accept(new GeoRenderProvider() {
            private final Supplier<GeoArmorRenderer<ExampleArmorItem>> renderer =
                Suppliers.memoize(() -> new GeoArmorRenderer<>(ExampleArmorItem.this));

            @Override
            public @Nullable GeoArmorRenderer<?, ?> getGeoArmorRenderer(ItemStack itemStack, EquipmentSlot equipmentSlot) {
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

## Renderer

Simple: `() -> new GeoArmorRenderer<>(ExampleArmorItem.this)`.

Advanced (must use `HumanoidRenderState` + `GeoRenderState`):

```java
public class ExampleArmorRenderer<R extends HumanoidRenderState & GeoRenderState> extends GeoArmorRenderer<ExampleArmorItem, R> {
    public ExampleArmorRenderer(Item item) {
        super(item);
    }
}
```

## Split sources

Same pattern as items: a `public final MutableObject<GeoRenderProvider> geoRenderProvider` field, `createGeoRenderer` accepts `this.geoRenderProvider.getValue()`, and the client setup sets the provider with a memoized `GeoArmorRenderer` supplier.

## Model requirements

- In Blockbench, create the model with model type **Armor** — it generates the correct template bones (`armor` prefixed).
- Only add cubes/bones inside the `armor`-prefixed bones.
- Use `properties.humanoidArmor(material, type)` for the item properties.

## Asset files

- Model: `assets/<mod_id>/geckolib/models/armor/<item_id>.geo.json`
- Animations: `assets/<mod_id>/geckolib/animations/armor/<item_id>.animation.json`
- Texture: `assets/<mod_id>/textures/armor/<item_id>.png`

## Common issues

- **`HumanoidModel not found` error** — split-sources project: `GeoArmorRenderer` and its code must live in the client sources, not common.

## Specialty: dyeable armor

For armor whose trim/dye color changes the texture, GeckoLib provides `DyeableGeoArmorRenderer` — use it instead of `GeoArmorRenderer` when the renderer must react to the stack's color data.

<!--
Source references:
- https://wiki.geckolib.com/docs/geckolib5/armor/intro
- https://wiki.geckolib.com/docs/geckolib5/armor/the-item-class
- https://wiki.geckolib.com/docs/geckolib5/armor/the-armor-renderer
- https://wiki.geckolib.com/docs/geckolib5/armor/applying-the-armor-renderer
- https://wiki.geckolib.com/docs/geckolib5/armor/common-issues
-->

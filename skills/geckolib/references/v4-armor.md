---
name: geckolib-v4-armor
description: GeckoLib 4 animated armor — ArmorItem + GeoItem, GeoArmorRenderer, humanoid armor model hook, bone naming, and split-source requirements.
---

# GeckoLib 4 Armor

Armor is an item that renders on the player's humanoid model. Extend `ArmorItem`, implement `GeoItem`, register synced, and supply a `GeoArmorRenderer` through the platform's armor-model hook.

## Armor item class

```java
public class ExampleArmorItem extends ArmorItem implements GeoItem {
    private final AnimatableInstanceCache cache = GeckoLibUtil.createInstanceCache(this);

    public ExampleArmorItem(ArmorMaterial material, ArmorItem.Type type, Properties properties) {
        super(material, type, properties);
        SingletonGeoAnimatable.registerSyncedAnimatable(this);
    }

    @Override
    public void registerControllers(AnimatableManager.ControllerRegistrar controllers) {
        controllers.add(new AnimationController<>(this, 20, state -> {
            state.setAnimation(DefaultAnimations.IDLE);
            Entity entity = state.getData(DataTickets.ENTITY);
            if (entity instanceof ArmorStand)
                return PlayState.CONTINUE;
            // Only animate when all 4 pieces are worn
            Set<Item> worn = new ObjectOpenHashSet<>();
            for (ItemStack stack : entity.getArmorSlots()) {
                if (stack.isEmpty()) return PlayState.STOP;
                worn.add(stack.getItem());
            }
            return worn.containsAll(Set.of(
                    ItemRegistry.EXAMPLE_ARMOR_HELMET.get(),
                    ItemRegistry.EXAMPLE_ARMOR_CHESTPLATE.get(),
                    ItemRegistry.EXAMPLE_ARMOR_LEGGINGS.get(),
                    ItemRegistry.EXAMPLE_ARMOR_BOOTS.get())) ? PlayState.CONTINUE : PlayState.STOP;
        }));
    }

    @Override
    public AnimatableInstanceCache getAnimatableInstanceCache() {
        return this.cache;
    }
}
```

## Renderer

```java
public class ExampleArmorRenderer extends GeoArmorRenderer<ExampleArmorItem> {
    public ExampleArmorRenderer() {
        super(new DefaultedItemGeoModel<>(new ResourceLocation(ModID, "armor/example_armor")));
    }
}
```

The Blockbench "GeckoLib Armor" template names bones for the humanoid (head, body, right/left arm, right/left leg, boots) so `GeoArmorRenderer` maps them automatically. Adjust the mapping by overriding the renderer's bone-assignment methods when needed.

## Registering the renderer

### Forge (1.19.3 → 1.20.5)

```java
@Override
public void initializeClient(Consumer<IClientItemExtensions> consumer) {
    consumer.accept(new IClientItemExtensions() {
        private GeoArmorRenderer<?> renderer;

        @Override
        public @NotNull HumanoidModel<?> getHumanoidArmorModel(LivingEntity entity, ItemStack stack,
                                                               EquipmentSlot slot, HumanoidModel<?> original) {
            if (this.renderer == null)
                this.renderer = new ExampleArmorRenderer();
            this.renderer.prepForRender(entity, stack, slot, original);
            return this.renderer;
        }
    });
}
```

### Fabric

```java
private final Supplier<Object> renderProvider = GeoItem.makeRenderer(this);

@Override
public Supplier<Object> getRenderProvider() { return this.renderProvider; }

@Override
public void createRenderer(Consumer<Object> consumer) {
    consumer.accept(new RenderProvider() {
        private GeoArmorRenderer<?> renderer;

        @Override
        public HumanoidModel<LivingEntity> getHumanoidArmorModel(LivingEntity entity, ItemStack stack,
                                                                 EquipmentSlot slot, HumanoidModel<LivingEntity> original) {
            if (this.renderer == null)
                this.renderer = new ExampleArmorRenderer();
            this.renderer.prepForRender(entity, stack, slot, original);
            return this.renderer;
        }
    });
}
```

Instantiate lazily (inside the hook), not as a field, to avoid incompatibilities.

## Split sources

`GeoArmorRenderer` and its registration are client-only: in Fabric split sources / Forge client source sets, keep the renderer class and the `initializeClient`/`createRenderer` code in the client source set, or you'll get errors like `BipedEntityModel not found` (yarn) / missing client classes.

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Geckolib-Armor-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Split-Sources-Support-(Geckolib4)
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->

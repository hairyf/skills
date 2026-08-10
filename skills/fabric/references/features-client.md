---
name: features-client
description: Client-side Fabric — entrypoint separation, rendering, entity/block-entity renderers, key binds, and HUD.
---

# Client Side

## Entrypoint separation

```java
public class MyModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        EntityRendererRegistry.register(MyMod.MY_ENTITY, MyEntityRenderer::new);
        BlockEntityRendererRegistry.register(MyMod.MY_BE, MyBlockEntityRenderer::new);
    }
}
```

Declared as `"client"` entrypoint in `fabric.mod.json`. Client-only classes must never be referenced from the common entrypoint.

## Entity renderer

```java
public class MyEntityRenderer extends EntityRenderer<MyEntity> {
    public MyEntityRenderer(EntityRendererFactory.Context ctx) { super(ctx); }
    @Override public Identifier getTexture(MyEntity entity) {
        return new Identifier("mymod", "textures/entity/my_entity.png");
    }
}
```

## Key binds

```java
public static final KeyBinding MY_KEY = KeyBindingHelper.registerKeyBinding(
    new KeyBinding("key.mymod.action", InputUtil.Type.KEYSYM, GLFW.GLFW_KEY_R,
        "category.mymod"));

// in ClientTickEvents.END_CLIENT_TICK:
while (MY_KEY.wasPressed()) { /* trigger */ }
```

## HUD

Implement `HudRenderCallback` (fabric-rendering-v1):

```java
HudRenderCallback.EVENT.register((context, tickCounter) -> {
    context.getMatrices(); // draw with context.drawText(...)
});
```

## Shaders / post-processing

For custom GLSL shaders and post-processing (e.g. VHS/CRT effects), use the **Veil** framework — see `skills/veil`.

## Key points

- Renderers, screens, key binds, and HUD are client-only — put them in the client entrypoint.
- `EntityRendererRegistry`/`BlockEntityRendererRegistry` are Fabric API (`fabric-rendering-v1`).
- Textures referenced by renderers live under `assets/<modid>/textures/`.

<!--
Source references:
- https://docs.fabricmc.net/develop/rendering
- https://docs.fabricmc.net/develop/commands
-->

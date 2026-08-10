---
name: features-events
description: Subscribe to Veil events on common, Forge/NeoForge, and Fabric code paths.
---

# Veil Events

Veil wraps its events for both platforms. Common code uses `VeilEventPlatform.INSTANCE`; Forge/NeoForge use bus events and Fabric use their own event objects.

## Available Events

| Event | Purpose |
|-------|---------|
| `FreeNativeResourcesEvent` | Free native GPU resources when unloading |
| `VeilAddShaderPreProcessorsEvent` | Register shader pre-processors |
| `VeilDynamicBuffersChangedEvent` | React to dynamic buffer enable/disable |
| `VeilPostProcessingEvent` | Pre/Post hooks for post-pipeline stages (upload uniforms here) |
| `VeilRegisterBlockLayersEvent` | Register block render layers |
| `VeilRegisterFixedBuffersEvent` | Register fixed buffers (see render-type stages) |
| `VeilRegisterGlobalControllersEvent` | Register global Flare controllers |
| `VeilRegisterInspectorsEvent` | Register editor inspectors |
| `VeilRenderLevelStageEvent` | Draw at level render stages |
| `VeilRendererAvailableEvent` | First renderer availability |
| `VeilShaderCompileEvent` | Shader compile hooks (loader-specific) |

## Common

```java
import foundry.veil.event.FreeNativeResourcesEvent;
import foundry.veil.platform.services.VeilEventPlatform;

public static void initCommon() {
    VeilEventPlatform.INSTANCE.onFreeNativeResources(() -> {
        // listener here
    });
}
```

## Forge / NeoForge

```java
import foundry.veil.forge.event.ForgeFreeNativeResourcesEvent;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.SubscribeEvent;

@SubscribeEvent
public void onEvent(ForgeFreeNativeResourcesEvent event) {
    // listener here
}
```

## Fabric

```java
import foundry.veil.fabric.event.FabricFreeNativeResourcesEvent;
import net.fabricmc.api.ClientModInitializer;

public class ModFabric implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        FabricFreeNativeResourcesEvent.EVENT.register(() -> {
            // listener here
        });
    }
}
```

The bridge methods are conveniences only — platform events behave identically.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/Events.md
- https://github.com/FoundryMC/Veil/blob/1.21/common/src/main/java/foundry/veil/api/event/
-->


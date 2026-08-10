---
name: features-events
description: Fabric API events — lifecycle, ticks, player, world, and networking hooks.
---

# Events

Fabric API events are registered once in the initializer; callbacks run on the relevant side.

## Lifecycle

```java
ServerLifecycleEvents.SERVER_STARTED.register(server -> { ... });
ServerLifecycleEvents.SERVER_STOPPING.register(server -> { ... });
```

## Ticks

```java
ServerTickEvents.END_SERVER_TICK.register(server -> { ... });
ServerTickEvents.END_WORLD_TICK.register(world -> { ... });
// client:
ClientTickEvents.END_CLIENT_TICK.register(client -> { ... });
```

## Player

```java
ServerPlayerEvents.AFTER_RESPAWN.register((old, player, alive) -> { ... });
ServerPlayerEvents.AFTER_DEATH.register((player, source) -> { ... });
```

## Networking

```java
// common registration of a custom packet id
public static final PacketType<MyC2SPacket> MY_C2S =
    PacketType.create(new Identifier("mymod", "my_c2s"), MyC2SPacket::new);

// server side receive
ServerPlayNetworking.registerGlobalReceiver(MY_C2S, (packet, player, responseSender) -> { ... });
// client side send
ClientPlayNetworking.send(MY_C2S, packet);
```

## Custom packets

Packets extend `CustomPayload`:

```java
public record MyC2SPacket(int value) implements CustomPayload {
    public static final PacketType<MyC2SPacket> TYPE =
        PacketType.create(new Identifier("mymod", "my_c2s"), buf -> new MyC2SPacket(buf.readInt()));

    @Override public void write(PacketByteBuf buf) { buf.writeInt(value); }
    @Override public PacketType<?> getId() { return TYPE; }
}
```

## Key points

- Register once — never inside tick handlers.
- Client-only events (`ClientTickEvents`, render events) only exist on the client side.
- Use `ServerPlayNetworking` for play-phase packets; `PayloadTypeRegistry` is handled by Fabric API.

<!--
Source references:
- https://docs.fabricmc.net/develop/events
- https://docs.fabricmc.net/develop/networking
-->

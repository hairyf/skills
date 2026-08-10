---
name: fabric-networking
description: Custom payloads, packet registration, sending/receiving between client and server, PlayerLookup.
---

# Networking

Packets are the only bridge between the logical client and logical server (a server always runs, even in singleplayer/LAN). Keep state synced or you get desyncs.

## Define a Payload

```java
public record ClientboundSummonLightningPayload(BlockPos pos) implements CustomPacketPayload {
    public static final Identifier ID = Identifier.fromNamespaceAndPath("example-mod", "summon_lightning");
    public static final CustomPayload.Type<ClientboundSummonLightningPayload> TYPE =
        new CustomPayload.Type<>(ID);
    public static final StreamCodec<FriendlyByteBuf, ClientboundSummonLightningPayload> CODEC =
        StreamCodec.composite(BlockPos.STREAM_CODEC, ClientboundSummonLightningPayload::pos,
            ClientboundSummonLightningPayload::new);

    @Override
    public CustomPayload.Type<? extends CustomPacketPayload> type() { return TYPE; }
}
```

## Register the Payload (common initializer)

```java
PayloadTypeRegistry.clientboundPlay().register(ClientboundSummonLightningPayload.TYPE,
    ClientboundSummonLightningPayload.CODEC);
// or PayloadTypeRegistry.serverboundPlay().register(...) for client → server
```

## Send & Receive

Server → client (from server code, e.g. item `use` on the logical server):

```java
ServerPlayNetworking.send(player, new ClientboundSummonLightningPayload(player.blockPosition()));
// broadcast to tracked players: PlayerLookup.tracking(level, pos) or PlayerLookup.all(server)
```

Client receive (client initializer):

```java
ClientPlayNetworking.registerGlobalReceiver(ClientboundSummonLightningPayload.TYPE, (payload, context) -> {
    // client-side handling; payload.pos() etc.
});
```

Client → server: build a serverbound payload, send with `ClientPlayNetworking.send(payload)`, receive in the common initializer with `ServerPlayNetworking.registerGlobalReceiver(TYPE, (payload, context) -> { ... })`.

## Security & Validation

Always validate serverbound packet content on the server: check entity existence by network id, distance limits, permissions. Never trust the client.

## Key Points

- `CustomPayload.Type` identifies the packet; `StreamCodec` serializes it (use `StreamCodec.composite` for records).
- Register on both physical sides (common code) before sending.
- `PlayerLookup` helpers handle tracking (players whose client knows an entity/chunk).

<!--
Source references:
- https://docs.fabricmc.net/develop/networking
-->

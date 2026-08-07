---
name: fabric-data-attachments
description: Attaching arbitrary data to entities, block entities, levels, and chunks with sync/persistence.
---

# Data Attachments

Attach arbitrary data to `Entity`, `BlockEntity`, `Level`, and `ChunkAccess`. Data is codec-based and can persist and/or sync.

## Creating Attachments

```java
public class ExampleModAttachments {
    // transient, not synced
    public static final AttachmentType<String> STRING = AttachmentRegistry.create(
        Identifier.fromNamespaceAndPath("example-mod", "string"));

    // synced + persistent with a default
    public static final AttachmentType<BlockPos> POS = AttachmentRegistry.create(
        Identifier.fromNamespaceAndPath("example-mod", "pos"),
        builder -> builder
            .syncWith(AttachmentSyncPredicate.all())
            .persistent(BlockPos.CODEC)
            .initializer(() -> BlockPos.ZERO));
}
```

Factory methods: `create()` (transient), `createPersistent(codec)`, `createDefaulted(codec, initializer)`; customize via the `builder` chain (`.syncWith(...)`, `.persistent(codec)`, `.copyOnDeath()`, `.initializer(...)`).

Sync predicates: `all()`, `targetOnly()` (only for player targets), `allButTarget()`, or custom via `AttachmentSyncPredicate`.

## Read / Write

Methods are injected onto `Entity`, `BlockEntity`, `ServerLevel`, `ChunkAccess`:

```java
String value = entity.getAttached(ExampleModAttachments.STRING);
String old = entity.setAttached(ExampleModAttachments.STRING, "new value");
BlockPos pos = entity.getAttachedOrCreate(ExampleModAttachments.POS); // default when present
```

Server-wide data: `Level.globalAttachments()` / `MinecraftServer.globalAttachments()`.

## Key Points

- Use **immutable values** and always update via API methods — partial mutation breaks persist/sync.
- Attachments replace full-value copies, so a big object change triggers a full re-sync to every tracking client. For several fields, split into multiple attachments or group them in a helper class (`Stamina.get(player).getCurrentStamina()`).

<!--
Source references:
- https://docs.fabricmc.net/develop/serialization/data-attachments
-->

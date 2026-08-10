---
name: geckolib-v4-triggerable-animations
description: GeckoLib 4 server-triggerable animations and native data syncing — triggerableAnim, triggerAnim, SerializableDataTicket, and setAnimData.
---

# GeckoLib 4 Triggerable Animations & Data Syncing

## Triggerable animations

Register a trigger on the controller:

```java
controllers.add(new AnimationController<>(this, "shoot_controller", state -> PlayState.STOP)
        .triggerableAnim("shoot", SHOOT_ANIM));
```

Trigger from the server (or client):

```java
// Entity
entity.triggerAnim("shoot_controller", "shoot");

// Item / singleton (player, stack id, controller, trigger)
triggerAnim(player, GeoItem.getOrAssignId(player.getItemInHand(hand), serverLevel), "shoot_controller", "shoot");

// Replaced entity
replacedEntity.triggerAnim(entity, "shoot_controller", "shoot");
```

While a triggered animation plays, the controller skips the `AnimationState` handler. It stops when finished or when `controller.stop()` is called. Prefer non-looping triggers. To let the handler interrupt triggers, call `.receiveTriggeredAnimations()` and check `controller.isPlayingTriggeredAnimation()`.

**Singleton requirement:** items and replaced entities must call `SingletonGeoAnimatable.registerSyncedAnimatable(this)` in the constructor for triggers/synced data to reach clients.

## Native data syncing (SerializableDataTicket)

Send small data blobs to relevant clients without custom packets. Register the ticket (mod constructor):

```java
public static final SerializableDataTicket<Integer> ANIM_STATE = GeckoLibUtil.addDataTicket(
        SerializableDataTicket.ofInt(new ResourceLocation("mymod", "anim_state")));
```

Send and read:

```java
// server side — sends to tracking clients (+self)
setAnimData(DataTickets.ACTIVE, true);                 // entity/block entity
singleton.setAnimData(entity, stackId, ticket, value); // singleton / replaced entity

// client side — read in controllers/renderers
boolean active = getAnimData(DataTickets.ACTIVE);
```

Built-in serializable tickets in `DataTickets`: `ANIM_STATE`, `ANIM`, `USE_TICKS`, `ACTIVE`, `OPEN`, `CLOSED`, `DIRECTION`. Built-in non-serializable tickets are listed in [Animatable Pattern](v4-animatable-pattern.md).

<!--
Source references:
- https://github.com/bernie-g/geckolib/wiki/Triggerable-Animations-(Geckolib4)
- https://github.com/bernie-g/geckolib/wiki/Geckolib-4-Changes
- https://github.com/bernie-g/geckolib/tree/1.20.1 (v4.4.9)
-->

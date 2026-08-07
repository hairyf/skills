---
name: fabric-class-tweakers
description: Access widening, interface injection, and enum extension via .classtweaker files.
---

# Class Tweakers

Class tweakers (formerly access wideners) apply compile-time-visible transformations to vanilla Minecraft classes: access widening, interface injection, and enum extension. They complement mixins (runtime-only) and require **Loader 0.18.0+ and Loom 1.12+** (enum extension: Loader 0.19.0+, Loom 1.16+, file header `v2`).

## Setup

File `src/main/resources/example-mod.classtweaker`:

```classtweaker
classTweaker  v1  official
```

Declare it in `build.gradle` (`loom { accessWidenerPath = file("src/main/resources/example-mod.classtweaker") }`) and `fabric.mod.json` (`"accessWidener": "example-mod.classtweaker"`). Comments start with `#`; entries use whitespace-separated tokens. Prefix any directive with `transitive-` to expose it to dependent mods. Validate with `./gradlew validateAccessWidener`; regenerate sources afterwards.

## Access Widening

- `accessible class <internalName>` — make class/method/field public.
- `extendable class|method ...` — non-final; methods protected if originally private.
- `mutable field <class> <name> <descriptor>` — remove final.

```classtweaker
accessible class net/minecraft/world/entity/player/Player
extendable method net/minecraft/world/entity/player/Player getInventory ()Lnet/minecraft/world/entity/player/Inventory;
mutable field net/minecraft/world/entity/player/Player experienceLevel I
```

Generate entries with [mcsrc.dev](https://mcsrc.dev) (right-click → Copy Class Tweaker / Access Widener) or the IntelliJ MCDev plugin. Necessary when accessors can't help (private classes, final methods/classes); vanilla-only — accessors remain the tool for other mods' targets.

## Interface Injection

```classtweaker
inject-interface net/minecraft/world/level/material/FlowingFluid com/example/interface_injection/BucketEmptySoundGetter
```

The interface must have **default** methods (implement real logic via a mixin on the target if needed) and methods prefixed `modid$` to avoid clashes. Generics use bytecode signature format (`<? extends Ljava/lang/String;>` etc.). Injections are visible in decompiled sources.

## Enum Extension

Mixin adds constants to an enum; the class tweaker makes them visible in sources:

```classtweaker
extend-enum net/minecraft/world/entity/npc/VillagerProfession EXAMPLE_MOD_NEW_PROFESSION
```

In the mixin: declare constants prefixed with your mod id, `@Shadow` constructors to pass args, implement abstract methods, and use `MixinIntrinsics.currentEnumOrdinal()` for ordinal-dependent constructors. Explicitly depend on `"fabricloader": ">=0.19.0"`. Pitfalls: unhandled switch expressions (other mods' entries crash) and serialized enums (avoid extending — indices shift).

<!--
Source references:
- https://docs.fabricmc.net/develop/class-tweakers/
- https://docs.fabricmc.net/develop/class-tweakers/access-widening
- https://docs.fabricmc.net/develop/class-tweakers/interface-injection
- https://docs.fabricmc.net/develop/class-tweakers/enum-extension
-->

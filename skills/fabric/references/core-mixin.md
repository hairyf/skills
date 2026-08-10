---
name: core-mixin
description: Mixins and access wideners — injecting into vanilla classes and widening access to private/package-private members.
---

# Mixin & Access Widener

## Mixin basics

```java
@Mixin(LivingEntity.class)
public abstract class LivingEntityMixin {
    @Inject(method = "tick", at = @At("HEAD"))
    private void mymod$onTick(CallbackInfo ci) {
        // injected code
    }
}
```

- Prefix your method names with `modid$` to avoid conflicts (e.g. `mymod$onTick`).
- Declare the mixin in `src/main/resources/mymod.mixins.json` and reference it in `fabric.mod.json` (`"mixins": ["mymod.mixins.json"]`).

```json
{
  "required": true,
  "package": "com.example.mixin",
  "compatibilityLevel": "JAVA_17",
  "mixins": ["LivingEntityMixin"],
  "client": ["ClientMixin"]
}
```

## Common injectors

| Injector | Use |
|----------|-----|
| `@Inject(method, at = @At("HEAD"/"RETURN"/"INVOKE"))` | run code around a method |
| `@Redirect(method, at = @At("INVOKE"), ...)` | replace a call result |
| `@ModifyVariable(method, ordinal, at = @At("HEAD"))` | change a local/parameter |
| `@Overwrite` | full method replacement (last resort) |

## Access widener

For vanilla fields/methods that are `private`/package-private and not reachable via mixins:

```text
accessWidener v1 named
accessible class net/minecraft/entity/LivingEntity field someField
mutable class net/minecraft/entity/LivingEntity field mutableField
accessible method net/minecraft/entity/LivingEntity someMethod ()V
```

Wire it in `build.gradle` and `fabric.mod.json`:

```groovy
loom { accessWidenerPath = file("src/main/resources/mymod.accesswidener") }
```

## Key points

- Prefer Fabric API / mixins over `@Overwrite` (mod conflicts).
- Mixins targeting vanilla are common-side by default; client-only mixins go in the `client` array.
- Always verify `@At` targets with `-mixin.checks` or the Loom dev environment logs.

<!--
Source references:
- https://docs.fabricmc.net/develop/mixins
- https://docs.fabricmc.net/develop/access-wideners
-->

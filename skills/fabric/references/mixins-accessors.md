---
name: fabric-mixin-accessors
description: Accessor and invoker mixins for fields, methods, constructors, and final classes.
---

# Mixin Accessors & Invokers

Accessor mixins expose otherwise inaccessible fields/methods without reloading Gradle. They only work on fields and methods — for private classes, final methods/classes use access wideners (`class-tweakers`).

## Structure

Accessor mixins are **interfaces** annotated `@Mixin(Target.class)` containing only `@Accessor`/`@Invoker` methods. Name files `XAccessor` and place them in a `mixin.accessor` package.

## Field Access

```java
@Mixin(Hud.class)
public interface HudAccessor {
    @Accessor("message")
    Component example_mod$getMessage();

    @Accessor("message")
    void example_mod$setMessage(Component message);
}
```

- Instance accessor methods should be prefixed `modid$` to avoid clashes.
- Static accessors need no prefix; bodies must throw (Mixin fills them in).
- Final fields: add `@Mutable` to the setter to remove `final` at application time.

## Method Invokers

```java
@Mixin(Inventory.class)
public interface InventoryAccessor {
    @Invoker("getItem")
    ItemStack example_mod$invokeGetItem(int slot);
}
```

Constructor invokers use `<init>`, are static, and conventionally named `newX`/`createX`:

```java
@Invoker("<init>")
static Identifier newIdentifier(String namespace, String path) { throw new AssertionError(); }
```

## Final Classes

You can't cast a final class directly to your accessor interface — cast via `Object`:

```java
((TargetClassAccessor) (Object) targetInstance).example_mod$accessorMethod(...);
```

## Key Points

- Accessors are safer/simpler than access widening for fields and methods; widening is required for classes and `final` members.
- Names must match the target exactly; wrong descriptors cause runtime application failures.

<!--
Source references:
- https://docs.fabricmc.net/develop/mixins/accessors
-->

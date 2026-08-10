---
name: fabric-entity-attributes
description: Registering custom attributes, attaching them to entities, reading and modifying values.
---

# Entity Attributes

## Register a Custom Attribute

```java
public class ModAttributes {
    public static final ResourceKey<Attribute> AGGRO_RANGE_KEY = ResourceKey.create(
        Registries.ATTRIBUTE, Identifier.fromNamespaceAndPath("example-mod", "aggro_range"));
    public static final Attribute AGGRO_RANGE = new Attribute("attribute.name.example-mod.aggro_range", 8.0);

    public static void register(ResourceKey<Attribute> key, Attribute attribute) {
        Registry.register(BuiltInRegistries.ATTRIBUTE, key, attribute);
    }
}
```

Translation: `"attribute.name.example-mod.aggro_range": "Aggro Range"`. Call a dummy `initialize()` from the mod initializer.

## Attach to Entities

Add to the entity's `createAttributes()`:

```java
return Mob.createMobAttributes()
    .add(Attributes.MAX_HEALTH, 20.0)
    .add(Attributes.MOVEMENT_SPEED, 0.25)
    .add(ModAttributes.AGGRO_RANGE, 8.0)
    .build();
```

## Read & Modify

```java
AttributeInstance instance = entity.getAttribute(ModAttributes.AGGRO_RANGE);
double value = instance.getValue();

instance.addTransitiveModifier(new AttributeModifier(id, 2.0, AttributeModifier.Operation.ADD_VALUE));
// or addPermanentModifier(...) for NBT-persisted modifiers
```

Modifier operations: `ADD_VALUE`, `ADD_MULTIPLIED_BASE`, `ADD_MULTIPLIED_TOTAL` (see the wiki). Use the value in entity AI (e.g. aggro distance).

<!--
Source references:
- https://docs.fabricmc.net/develop/entities/attributes
-->

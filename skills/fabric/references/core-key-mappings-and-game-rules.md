---
name: fabric-key-mappings-and-game-rules
description: Client key mappings with KeyMappingHelper and custom game rules.
---

# Key Mappings & Game Rules

## Key Mappings (client only)

Register in the **client initializer**:

```java
KeyMapping keyMapping = KeyMappingHelper.registerKeyMapping(
    "key.example-mod.send_to_chat",           // translation key
    InputConstants.KEY_C,                     // default key (US layout)
    KeyMapping.CATEGORY_MISC                  // or a custom category
);
```

Custom category: register its translation key as `key.category.<namespace>.<path>`. `ToggleKeyMapping` (sticky keys) also works with `KeyMappingHelper`. React in `ClientTickEvents.END_CLIENT_TICK`, guarding repeat triggers:

```java
ClientTickEvents.END_CLIENT_TICK.register(client -> {
    while (keyMapping.consumeClick()) {
        client.player.displayClientMessage(Component.literal("Key Pressed!"), true);
    }
});
```

Note: `InputConstants.KEY_*` assumes a standard US layout (AZERTY users typing "A" report `KEY_Q`).

## Game Rules

Create a `GameRules` holder class:

```java
public class ExampleModGameRules {
    public static final ResourceKey<GameRules> BAD_VISION_KEY = ResourceKey.create(Registries.GAME_RULE,
        Identifier.fromNamespaceAndPath("example-mod", "bad_vision"));
    public static final GameRules.GameRuleKey<GameRules.BooleanValue> BAD_VISION =
        GameRules.register(BAD_VISION_KEY, GameRuleCategory.MISC, GameRules.BooleanValue.create(false));
}
```

Supported value types: boolean, `Integer`, `Double`, `Enum` (plus custom). Access at runtime:

```java
boolean badVision = serverLevel.getGameRules().get(ExampleModGameRules.BAD_VISION).get();
```

Translations:

```json
{
  "example-mod.bad_vision": "Bad Vision",
  "gamerule.example-mod.bad_vision": "Gives every player the blindness effect"
}
```

Players change it in-game with `/gamerule example-mod:bad_vision true`.

<!--
Source references:
- https://docs.fabricmc.net/develop/key-mappings
- https://docs.fabricmc.net/develop/game-rules
-->

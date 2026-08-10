---
name: fabric-text-and-translations
description: Component objects, translatable text, JSON serialization, formatting and chat colors.
---

# Text and Translations

All displayed text is a `Component`, not a `String`, enabling formatting, click events, and translations.

## Literal & Translatable Components

```java
Component literal = Component.literal("Hello!");
MutableComponent hello = Component.translatable("example-mod.text.hello", player.getDisplayName());
```

- `Component.nullToEmpty(...)` accepts null; `Component.literal(...)` returns a `MutableComponent` for styling/concatenation.
- Use `Component.translatable(key, args...)` for i18n. `%1$s`, `%2$s`... reference the arguments in order.
- Use `player.getDisplayName()` / `stack.getDisplayName()` for hoverable names in messages.

Language file `assets/<mod>/lang/en_us.json`:

```json
{
  "example-mod.text.hello": "%1$s said hello!"
}
```

Missing keys fall back to the raw key.

## Serialization

Components round-trip to the JSON text format via the text codec:

```java
DataResult<JsonElement> json = ComponentSerialization.CODEC.encodeStart(JsonOps.INSTANCE, component);
DataResult<Component> back = ComponentSerialization.CODEC.parse(JsonOps.INSTANCE, element);
```

Use this JSON anywhere the game accepts JSON text (datapacks, commands, books, signs).

## Formatting

```java
MutableComponent styled = Component.literal("Hello World!")
    .withStyle(ChatFormatting.AQUA, ChatFormatting.BOLD, ChatFormatting.UNDERLINE);
```

Standard codes: `§0`–`§f` colors (black, dark blue, dark green, dark aqua, dark red, dark purple, gold, gray, dark gray, blue, green, aqua, red, light purple, yellow, white); `§r` reset; `§l` bold; `§m` strikethrough; `§n` underline; `§o` italic; `§k` obfuscated. In code, prefer `ChatFormatting` constants over raw codes.

## Key Points

- Prefer translatable components over literals so resource packs/other languages can translate your UI.
- Item/block/enchantment/effect names all use the same component system with auto-generated keys (`item.<mod>.<id>`, `block.<mod>.<id>`, etc.).

<!--
Source references:
- https://docs.fabricmc.net/develop/text-and-translations
-->

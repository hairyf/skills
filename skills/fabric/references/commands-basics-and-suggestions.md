---
name: fabric-commands
description: Registering Brigadier commands, requirements, sub-commands, client commands, redirects, and suggestions.
---

# Commands & Suggestions

Brigadier is a tree-based command parser; commands are built from `literal` and `argument` nodes.

## Register a Command

```java
CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
    dispatcher.register(Commands.literal("test_command")
        .executes(ExampleModCommands::executeTestCommand));
});

private static int executeTestCommand(CommandContext<CommandSourceStack> context) {
    CommandSourceStack source = context.getSource();
    source.sendSuccess(() -> Component.literal("Hello!"), false);
    return Command.SINGLE_SUCCESS;
}
```

- `sendSuccess` first arg is `Supplier<Component>`; second bool = broadcast to ops (true when the command changes the world).
- Return ≤ 0 for failure; `Command.SINGLE_SUCCESS` (1) for success. Throw `CommandSyntaxException` for syntax errors.
- Registration happens in the mod initializer; use `Commands.literal/argument`, not Brigadier's raw builders.

## Requirements & Environments

```java
dispatcher.register(Commands.literal("mod_command")
    .requires(source -> source.hasPermission(2)) // only ops
    .executes(...));
```

`requires` gates visibility in tab completion too. Check `environment` (`Commands.CommandSelection.INTEGRATED`/`DEDICATED`) for server-only registration.

## Sub-Commands & Redirects

Append nested literals for sub-commands; `.redirect(existingCommand)` creates aliases (note: Brigadier only redirects nodes with arguments — for argument-less aliases share the executes method instead).

## Client Commands

`ClientCommandRegistrationCallback.EVENT.register((dispatcher, registryAccess) -> ...)` with `ClientCommands.literal(...)` — client-only code in `src/client`, never runs on servers.

## Suggestions

Attach providers with `.suggests(provider)`:

```java
Commands.argument("target", EntityArgument.entity())
    .suggests(SuggestionProviders.SUMMONABLE_ENTITIES)
```

Built-ins: `SUMMONABLE_ENTITIES`, `AVAILABLE_SOUNDS`, `LootCommand.SUGGESTION_PROVIDER`, `ALL_BIOMES`. Custom providers implement `SuggestionProvider<S>` (returns `CompletableFuture<Suggestions>`, can read context for stateful suggestions).

<!--
Source references:
- https://docs.fabricmc.net/develop/commands/basics
- https://docs.fabricmc.net/develop/commands/suggestions
-->

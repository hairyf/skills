---
name: fabric-command-arguments
description: Command arguments, optional arguments, custom ArgumentType implementations.
---

# Command Arguments

## Built-in Arguments

```java
dispatcher.register(Commands.literal("command_with_arg")
    .then(Commands.argument("value", IntegerArgumentType.integer())
        .executes(ctx -> {
            int value = IntegerArgumentType.getInteger(ctx, "value");
            ctx.getSource().sendSuccess(() -> Component.literal("value = " + value), false);
            return Command.SINGLE_SUCCESS;
        })));
```

Make arguments optional by chaining `.executes` on the parent literal too, or share one method:

```java
Commands.literal("cmd")
    .executes(ctx -> executeCommon(ctx, 0))
    .then(Commands.argument("value", IntegerArgumentType.integer())
        .executes(ctx -> executeCommon(ctx, IntegerArgumentType.getInteger(ctx, "value"))));
```

## Custom Argument Types

Implement `ArgumentType<T>` with a `parse(StringReader)`:

```java
public class BlockPosArgumentType implements ArgumentType<BlockPos> {
    public static BlockPosArgumentType blockPos() { return new BlockPosArgumentType(); }

    @Override
    public BlockPos parse(StringReader reader) throws CommandSyntaxException {
        reader.expect('{');
        int x = reader.readInt();
        reader.expect(',');
        int y = reader.readInt();
        reader.expect(',');
        int z = reader.readInt();
        reader.expect('}');
        return new BlockPos(x, y, z);
    }
}
```

**Register on both sides** so completion/parsing works:

```java
ArgumentTypeRegistry.register(Identifier.fromNamespaceAndPath("example-mod", "block_pos"),
    BlockPosArgumentType.class, MapCodec.unit(BlockPosArgumentType::new));
```

Use it in commands with `Commands.argument("pos", BlockPosArgumentType.blockPos())`. Avoid ambiguous argument trees (one node, multiple argument types).

<!--
Source references:
- https://docs.fabricmc.net/develop/commands/arguments
-->

---
name: fabric-mixin-bytecode
description: JVM bytecode fundamentals needed to target mixins: descriptors, LVT, operand stack, common instructions.
---

# Mixin & JVM Bytecode

Mixins transform Minecraft classes (and other mods' classes) at load time — the only class transformation Fabric Loader officially supports. Targeting mixins requires reading bytecode.

## Names & Descriptors

- **Internal class names**: `net/minecraft/world/entity/...` (slashes), not dotted.
- **Type descriptors**: `I` int, `Z` boolean, `J` long, `F` float, `D` double, `Ljava/lang/String;` object, `[I` int array, `(params)return` method descriptor (e.g. `(Lnet/minecraft/world/level/Level;)V`).

## Execution Model

Methods execute over a **local variable table (LVT)** and an **operand stack**. Instance methods put `this` in LVT slot 0. Instructions pop operands, compute, push results — e.g. `getfield x` pops the receiver and pushes the field; `iadd` pops two ints, pushes the sum.

## Common Instructions

- Constants: `iconst_0..5`, `lconst/dconst/fconst`, `bipush/sipush`, `ldc` (strings, big numbers).
- Variables: `iload/istore` (int/bool/byte/char/short), `lload/lstore`, `fload/fstore`, `dload/dstore`, `aload/astore` (references).
- Fields: `getfield/putfield` (instance), `getstatic/putstatic`.
- Invocation: `invokestatic`, `invokevirtual` (polymorphic), `invokespecial` (exact — constructors/super), `invokeinterface`.
- Operators: `iadd/isub/imul/idiv/irem/ineg` and `l/f/d` variants.
- Returns: `ireturn/lreturn/freturn/dreturn/areturn/return`.
- Control flow: `goto`, `ifeq/ifne` (compare top to 0), `if_icmpXX` (compare two ints).
- Objects: `new` then `dup` then `invokespecial <init>` (two stack copies needed: one consumed by `<init>`, one returned).
- Lambdas: compiled into a synthetic `lambda$...` method plus `invokedynamic` — target the synthetic method to inject into lambda bodies. Captured variables become extra parameters; string concat uses `invokedynamic` (`makeConcatWithConstants`).

## Why It Matters for Mixins

Compiler output rarely matches source structure — `if` blocks may share labels, so a "logical" injection point may not exist in bytecode. Inspect bytecode (IDE, `javap`) before choosing injection points, and prefer Fabric API events/accessors when they suffice.

<!--
Source references:
- https://docs.fabricmc.net/develop/mixins/bytecode
-->

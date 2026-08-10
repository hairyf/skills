---
name: minecraft-modding-vanilla-reference
description: Locate and adapt the closest vanilla Minecraft implementation for a mod feature using pinned mapped sources, call sites, registries, resources, and runtime behavior.
---

# Vanilla Reference

## Workflow

1. Establish project context first (see [core-project-context](core-project-context.md)), especially the exact Minecraft version and mappings.
2. Translate the desired behavior into vanilla nouns and verbs: object type, trigger, state owner, side, persistence, rendering, and data resources.
3. Search mapped dependency sources/generated sources first. Use project mappings; do not paste names from another mapping namespace.
4. Trace beyond the headline class: registration, constructor/call sites, lifecycle hooks, serialization, networking, renderer, tags, recipes, loot, and language/model resources.
5. Summarize the minimal behavior path with evidence-bearing class/method/resource names.
6. Separate reusable pattern from vanilla-specific assumptions such as hard-coded registry entries, private access, global singleton state, or privileged engine hooks.
7. Adapt to the project's loader and conventions. Prefer public loader APIs; use Mixin injection only if a verified public path is insufficient (see the [fabric skill](../../fabric/SKILL.md) for loader APIs and Mixin details).

## Guardrails

- Verify semantics from the pinned source, not from similarly named methods in another version.
- Do not copy large source sections or preserve unnecessary private implementation details.
- Check logical side, thread, ownership, and data-driven alternatives before porting code.
- Record uncertainty when source artifacts are unavailable; recommend how to obtain matching sources rather than guessing.

Report the chosen analogue, why it matches, traced dependencies, intentional differences, and validation plan.

<!--
Source references:
- temporarily/skills/mc-vanilla-reference/SKILL.md
-->

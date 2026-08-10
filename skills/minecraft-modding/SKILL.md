---
name: minecraft-modding
description: Cross-loader Minecraft Java mod development workflow — audit project context, mine vanilla implementations, follow the standard implementation checklist, and debug/fix defects. Use before or during any Minecraft mod feature work (Fabric, NeoForge, or Forge); pairs with the `fabric` skill for loader APIs and the `geckolib` skill for animation APIs.
metadata:
  author: Hairy
  version: "2026.8.10"
  source: Consolidated from temporarily/skills/mc-*, scripts at https://github.com/hairyf/skills
---

# Minecraft Modding (Java)

> Consolidated on 2026-08-10 from the 12 temporary `mc-*` development skills (`temporarily/skills/mc-*`). This is the loader-agnostic workflow layer: it does not repeat content that dedicated skills in this repository already cover, so implementation topics link out to them instead.

This skill covers the shared Minecraft Java mod development workflow: establishing verified project context, adapting vanilla implementations, following a standard implementation and verification checklist, and diagnosing/fixing defects. It applies to Fabric, NeoForge, and Forge projects and is version- and loader-agnostic: always derive APIs from the pinned version and mappings, never from memory or generic snippets.

## Standard Workflow

1. Audit the repository with [core-project-context](references/core-project-context.md): exact Minecraft/loader versions, mappings, Java/Gradle toolchain, modules, registration style, side boundaries, and project conventions.
2. Find the closest vanilla or in-repo analogue with [core-vanilla-reference](references/core-vanilla-reference.md); copy only patterns compatible with the pinned version and mappings.
3. Define observable behavior, server authority, persistence needs, and acceptance checks before editing.
4. Implement the smallest coherent vertical slice: registration, class/behavior, resource references, and initialization wiring. Register exactly once; keep client-only code out of common/server initialization.
5. Add only applicable assets/data: blockstates, models, loot tables, recipes, tags, advancements, and translations. Prefer data generation over hand-written JSON.
6. Keep every user-visible string in `zh_cn`, `zh_tw`, and `en_us`; derive Traditional Chinese naturally rather than copying Simplified Chinese.
7. Verify: compile/build, run data generation when configured, launch the narrowest relevant client/server test, and inspect logs rather than relying on exit code alone.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Project Context | Audit versions, loader, mappings, source structure, and conventions before coding | [core-project-context](references/core-project-context.md) |
| Vanilla Reference | Find and adapt the closest vanilla implementation from pinned mapped sources | [core-vanilla-reference](references/core-vanilla-reference.md) |
| Debug & Fix | Reproduce, diagnose, and fix build, crash, data, networking, and gameplay defects | [best-practices-debug-and-fix](references/best-practices-debug-and-fix.md) |

## Implementation Topics — Existing Skills

The following topics from the temporary `mc-*` skills are already covered by dedicated skills in this repository; use those instead of duplicating content here. The `fabric` skill documents Fabric-specific APIs; for NeoForge or Forge projects apply the same Standard Workflow with that loader's own APIs (no dedicated NeoForge/Forge skill exists here yet).

| Topic | Use skill |
|-------|-----------|
| Blocks & Items | [fabric](../fabric/SKILL.md) |
| Entities & Mobs | [fabric](../fabric/SKILL.md) |
| Events & Core Logic | [fabric](../fabric/SKILL.md) |
| Networking | [fabric](../fabric/SKILL.md) |
| GUI & Screens | [fabric](../fabric/SKILL.md) |
| Mixin Injection | [fabric](../fabric/SKILL.md) |
| Data Generation | [fabric](../fabric/SKILL.md) |
| World Generation | [fabric](../fabric/SKILL.md) |
| GeckoLib Animation | [geckolib](../geckolib/SKILL.md) |

## Related Skills

- [fabric](../fabric/SKILL.md) — Fabric-specific APIs: Loom, entrypoints, registration, events, networking, rendering, datagen, mixins, testing.
- [geckolib](../geckolib/SKILL.md) — GeckoLib v4/v5 API: setup, animatables, controllers, renderers, resources, data syncing.

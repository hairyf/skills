---
name: minecraft-modding-project-context
description: Inspect a Minecraft Java mod repository and establish verified project context before implementation — versions, loader, mappings, modules, registration style, side separation, conventions.
---

# Project Context

Establish facts from the repository before proposing code. Do not infer APIs from the phrase "high version" or from memory.

## Inspect

1. Read repository instructions and the root/module build files.
2. Identify the exact Minecraft version, loader and loader version, mappings, Java toolchain, Gradle plugin, modules, dependencies, and access-widener/transformer/Mixin setup.
3. Locate the mod metadata, entrypoints, mod id, base package, registration pattern, client source set, data generator, run configurations, and test framework.
4. Find one nearby implementation that represents the project's current style.
5. Record uncertainties as unknown; resolve them from lockfiles, Gradle properties, source, generated sources, or dependency caches before coding.

## Produce a context brief

Report:

- exact versions and evidence-bearing file paths;
- safe commands already defined by the project;
- relevant source/resource roots and side boundaries;
- conventions to copy;
- risks such as mixed mappings, stale examples, duplicate registrations, or incompatible tutorials;
- the smallest validation command for the requested task.

## Guardrails

- Prefer repository APIs and pinned dependency docs over generic snippets.
- Never silently upgrade Minecraft, loader, Java, Gradle, mappings, or libraries.
- Preserve the existing loader unless migration is explicitly requested.
- Treat dedicated-server compatibility as mandatory: keep rendering, keybinds, screens, and client-only classes out of common/server initialization.
- For user-visible content, maintain `zh_cn`, `zh_tw`, and `en_us`; derive Traditional Chinese wording naturally rather than mechanically copying Simplified Chinese.

Use the resulting brief as working context for other Minecraft work and refresh it when build files change.

<!--
Source references:
- temporarily/skills/mc-project-context/SKILL.md
-->

---
name: minecraft-modding-debug-and-fix
description: Reproduce, diagnose, and fix Minecraft Java mod build, startup, registry, data, rendering, networking, compatibility, and gameplay defects — with evidence-based root-cause methodology and guardrails.
---

# Debug and Fix

## Diagnose before changing code

1. Establish project context first (see [core-project-context](core-project-context.md)) and preserve the failing versions.
2. Capture exact reproduction steps, expected/actual behavior, side, environment, mod list, and the first failing run/log.
3. Read the complete exception chain. Prefer the earliest relevant `Caused by` and project frame over the final wrapper exception.
4. Classify the failure: compile/mappings, classloading/side, registry/lifecycle, missing resource/data, serialization, networking, Mixin conflict, compatibility, or gameplay logic.
5. Form one falsifiable hypothesis and gather evidence with targeted search, logs, breakpoints, or a minimal test. Do not apply broad speculative edits.
6. Implement the smallest root-cause fix consistent with repository patterns.

## Validate

Run the original reproduction first, then a focused regression check and the relevant compile/build. For side or networking defects, include dedicated-server or two-client verification where feasible. Review logs for new warnings rather than relying only on exit code.

## Guardrails

- Do not delete caches, worlds, configs, lockfiles, or user data without explicit approval.
- Do not "fix" incompatibility by silently changing pinned versions or removing mods.
- Preserve crash evidence before changing configuration.
- Add null checks only when absence is valid; otherwise repair the violated lifecycle invariant.

Report root cause, evidence, files changed, commands run, remaining uncertainty, and rollback considerations.

<!--
Source references:
- temporarily/skills/mc-debug-fix/SKILL.md
-->

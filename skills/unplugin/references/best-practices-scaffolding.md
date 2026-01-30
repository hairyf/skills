---
name: unplugin-scaffolding
description: Templates and prerequisites for starting a new unplugin package; try online.
---

# Unplugin Scaffolding

## Prerequisites

- **Node.js** 18.12.0 or later.
- **webpack** 5 or later when targeting webpack.

## Templates

Use a starter repo to bootstrap a new unplugin package with the correct structure (exports, build, tests):

- **[unplugin/unplugin-starter](https://github.com/unplugin/unplugin-starter)** — Official template; includes multi-bundler setup, subpath exports, and fixture tests.
- **[sxzz/unplugin-starter](https://github.com/sxzz/unplugin-starter)** — Alternative starter with similar layout.

After cloning or using the template, rename the package (e.g. `unplugin-foo`), implement your factory and hooks, and adjust `package.json` (name, keyword `unplugin`, exports) per [best-practices-conventions](best-practices-conventions.md).

## Try online

You can try unplugin in the browser without cloning:

- [Open in Codeflow](https://stackblitz.com/~/github.com/yuyinws/unplugin-starter?file=src/index.ts) — Unplugin-starter–based demo on StackBlitz/Codeflow.

Useful for quick experiments or sharing a minimal repro.

<!--
Source references:
- sources/unplugin/docs/guide/index.md (Creating an Unplugin package, Trying It Online, Pre-requisites)
-->

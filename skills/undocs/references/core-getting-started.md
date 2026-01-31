---
name: undocs-getting-started
description: Get started with undocs - create a documentation site using the CLI and template
---

# Getting Started with Undocs

Undocs is a minimal Documentation Theme and CLI for shared usage across UnJS projects. It's built with Nuxt, Nuxt Content, and Nuxt UI with zero config and an elegant CLI wrapper.

## Quick Start

Create a new documentation project using the template:

```bash
npx giget gh:unjs/undocs/template docs --install
```

Navigate to the docs directory:

```bash
cd docs/
```

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Build for production:

```bash
npm run build
# or
pnpm build
# or
yarn build
```

## Project Structure

After creating a project, you'll have:

```
docs/
├── .config/
│   └── docs.yaml          # Configuration file
├── .docs/
│   └── public/            # Static assets
├── 1.guide/               # Documentation pages
│   └── 1.index.md
└── package.json
```

## Key Points

- Undocs uses Nuxt Content for markdown processing
- Configuration is done via `.config/docs.yaml`
- Documentation pages are organized in numbered directories (e.g., `1.guide/`, `2.config/`)
- The CLI handles all Nuxt configuration automatically
- Zero config required - works out of the box

<!--
Source references:
- https://github.com/unjs/undocs
- https://undocs.unjs.io
-->

---
name: features-deploy
description: Netlify deployment and SPA redirect in arch-nuxt-lite
---

# Deploy (Netlify)

The template is set up for **Netlify** with a static build and SPA fallback. Build output is `dist/`; all routes are redirected to `index.html` for client-side routing.

## Usage

**netlify.toml**:

```toml
[build]
publish = "dist"
command = "pnpm run build"

[build.environment]
NODE_VERSION = "23"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

- **publish** — Netlify serves the `dist` folder.
- **command** — Runs `pnpm run build` (Vite build).
- **redirects** — SPA fallback: every path serves `index.html` so Vue Router can handle routes.

## Key points

- Use Node 18+ (e.g. 23) in `NODE_VERSION` for compatibility with Vite and Vue tooling.
- For other hosts (Vercel, Cloudflare Pages, etc.), configure the same: build with `pnpm run build` and a catch-all redirect to `index.html`.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
-->

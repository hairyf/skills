---
name: core-scripts
description: npm/pnpm scripts in arch-nuxt-lite
---

# Scripts (package.json)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite --port 3333 --open` | Start dev server on port 3333 and open browser |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Serve `dist/` locally |
| `lint` | `eslint .` | Lint with ESLint |
| `typecheck` | `vue-tsc` | Type-check with Vue TSC |
| `test` | `vitest` | Run Vitest (unit and component tests) |
| `up` | `taze major -I` | Upgrade dependencies (major, interactive) |
| `postinstall` | `npx simple-git-hooks` | Install git hooks (pre-commit runs lint-staged) |

**lint-staged** runs `eslint --fix` on staged files; **simple-git-hooks** sets `pre-commit` to `pnpm lint-staged`.

## Key points

- Use `pnpm dev` for development; `pnpm build` then `pnpm preview` to verify production build.
- Commit the generated `auto-imports.d.ts`, `components.d.ts`, and `typed-router.d.ts` (or equivalent) so types stay in sync.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
-->

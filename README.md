# Hairy's Skills

> Forked from [antfu/skills](https://github.com/antfu/skills)

A curated collection of [Agent Skills](https://agentskills.io/home) based on [Anthony Fu's skills collection](https://github.com/antfu/skills), extended with additional skills reflecting [Hairyf](https://github.com/hairyf)'s preferences, experience, and best practices for web development.

> [!IMPORTANT]
> This is a proof-of-concept project for generating agent skills from source documentation and keeping them in sync.
> I haven't fully tested how well the skills perform in practice, so feedback and contributions are greatly welcome.

## Installation

```bash
pnpx skills add hairyf/skills
```

or to install all of them globally:

```bash
pnpx skills add hairyf/skills --all -g
```

Learn more about the CLI usage at [skills](https://github.com/vercel-labs/skills).

## Skills

This collection extends Anthony Fu's original collection with additional skills from Hairyf. It includes skills from different sources with different scopes, covering both Vue/Vite/Nuxt ecosystem and React/Next.js ecosystem.

### Hand-maintained Skills

> Opinionated

Manually maintained skills reflecting personal preferences and best practices.

| Skill | Description | Maintainer |
|-------|-------------|------------|
| [hairy](skills/hairy) | Hairyf's preferences and best practices for web development (TypeScript, ESLint, pnpm, Vitest, etc.) | Hairyf |
| [antfu](skills/antfu) | Anthony Fu's preferences and best practices for app/library projects (eslint, pnpm, vitest, vue, etc.) | Anthony Fu |

### Skills Generated from Official Documentation

> Unopinionated but with tilted focus (e.g. TypeScript, ESM, Composition API, and other modern stacks)

Generated from official documentation and fine-tuned for agent usage.

#### Vue Ecosystem

| Skill | Description | Source |
|-------|-------------|--------|
| [vue](skills/vue) | Vue.js core - reactivity, components, composition API | [vuejs/docs](https://github.com/vuejs/docs) |
| [nuxt](skills/nuxt) | Nuxt framework - file-based routing, server routes, modules | [nuxt/nuxt](https://github.com/nuxt/nuxt) |
| [pinia](skills/pinia) | Pinia - intuitive, type-safe state management for Vue | [vuejs/pinia](https://github.com/vuejs/pinia) |
| [vite](skills/vite) | Vite build tool - config, plugins, SSR, library mode | [vitejs/vite](https://github.com/vitejs/vite) |
| [vitepress](skills/vitepress) | VitePress - static site generator powered by Vite | [vuejs/vitepress](https://github.com/vuejs/vitepress) |
| [vitest](skills/vitest) | Vitest - unit testing framework powered by Vite | [vitest-dev/vitest](https://github.com/vitest-dev/vitest) |
| [unocss](skills/unocss) | UnoCSS - atomic CSS engine, presets, transformers | [unocss/unocss](https://github.com/unocss/unocss) |

#### React Ecosystem

| Skill | Description | Source |
|-------|-------------|--------|
| [react-use](skills/react-use) | React Use - collection of essential React Hooks | [streamich/react-use](https://github.com/streamich/react-use) |
| [next](skills/next) | Next.js - React framework for production | [vercel/next.js](https://github.com/vercel/next.js) |
| [tailwindcss](skills/tailwindcss) | Tailwind CSS - utility-first CSS framework | [tailwindlabs/tailwindcss.com](https://github.com/tailwindlabs/tailwindcss.com) |

#### Backend & Tools

| Skill | Description | Source |
|-------|-------------|--------|
| [nest](skills/nest) | NestJS - progressive Node.js framework | [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com) |
| [pnpm](skills/pnpm) | pnpm - fast, disk space efficient package manager | [pnpm/pnpm.io](https://github.com/pnpm/pnpm.io) |
| [tsdown](skills/tsdown) | tsdown - TypeScript library bundler powered by Rolldown | [rolldown/tsdown](https://github.com/rolldown/tsdown) |

#### Animation Libraries

| Skill | Description | Source |
|-------|-------------|--------|
| [motion](skills/motion) | Motion - animation library for the web | [motiondivision/motion](https://github.com/motiondivision/motion) |
| [anime](skills/anime) | Anime.js - JavaScript animation engine | [juliangarnier/anime](https://github.com/juliangarnier/anime) |

#### State Management

| Skill | Description | Source |
|-------|-------------|--------|
| [valtio](skills/valtio) | Valtio - proxy-state library for React and Vanilla | [pmndrs/valtio](https://github.com/pmndrs/valtio) |

### Vendored Skills

Synced from external repositories that maintain their own skills.

#### Official Skills

| Skill | Description | Source |
|-------|-------------|--------|
| [slidev](skills/slidev) | Slidev - presentation slides for developers | [slidevjs/slidev](https://github.com/slidevjs/slidev) |
| [vueuse-functions](skills/vueuse-functions) | VueUse - 200+ Vue composition utilities | [vueuse/skills](https://github.com/vueuse/skills) |
| [turborepo](skills/turborepo) | Turborepo - high-performance build system for monorepos | [vercel/turborepo](https://github.com/vercel/turborepo) |

#### Hairyf's Projects

| Skill | Description | Source |
|-------|-------------|--------|
| [hairy-utils](skills/hairy-utils) | Hairy Utils - utility functions library | [hairyf/hairylib](https://github.com/hairyf/hairylib) |
| [hairy-react-lib](skills/hairy-react-lib) | Hairy React Lib - React utilities and components | [hairyf/hairylib](https://github.com/hairyf/hairylib) |
| [valtio-define](skills/valtio-define) | Valtio Define - type-safe state management for Valtio | [hairyf/valtio-define](https://github.com/hairyf/valtio-define) |
| [overlastic](skills/overlastic) | Overlastic - overlay management library | [hairyf/overlastic](https://github.com/hairyf/overlastic) |

#### Community Skills

| Skill | Description | Source |
|-------|-------------|--------|
| [vue-best-practices](skills/vue-best-practices) | Vue 3 + TypeScript best practices for Volar | [hyf0/vue-skills](https://github.com/hyf0/vue-skills) |
| [web-design-guidelines](skills/web-design-guidelines) | Web design guidelines for building beautiful interfaces | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |

## What Makes This Collection Different?

This collection is based on [Anthony Fu's skills collection](https://github.com/antfu/skills) and extends it with:

- **Additional Skills**: More skills covering React/Next.js ecosystem, animation libraries, and backend frameworks
- **Hairyf's Projects**: Skills for Hairyf's own open-source projects (hairylib, valtio-define, overlastic)
- **Personal Preferences**: Hairyf's own opinionated preferences and best practices

The key difference from the original collection is that it uses git submodules to directly reference source documentation. This provides more reliable context and allows the skills to stay up-to-date with upstream changes over time.

The project is also designed to be flexible - you can use it as a template to generate your own skills collection.

## Generate Your Own Skills

Fork this project to create your own customized skill collection.

1. Fork or clone this repository
2. Install dependencies: `pnpm install`
3. Update `meta.ts` with your own projects and skill sources
4. Run `nr start cleanup` to remove existing submodules and skills
5. Run `nr start init` to clone the submodules
6. Run `nr start sync` to sync vendored skills
7. Ask your agent to "generate skills for \<project\>" (recommended one at a time to manage token usage)

See [AGENTS.md](AGENTS.md) for detailed generation guidelines.

## Credits

- Original project: [antfu/skills](https://github.com/antfu/skills) by [Anthony Fu](https://github.com/antfu)
- Extended by: [Hairyf](https://github.com/hairyf)

## License

Skills and the scripts in this repository are [MIT](LICENSE.md) licensed.

Vendored skills from external repositories retain their original licenses - see each skill directory for details.

---
name: core-bin-entry
description: bin field, dev vs prod CLI entry, and shebang in arch-tsdown-cli
---

# Bin Entry and CLI Invocation

The starter uses two bin scripts: one for **development** (tsx + source) and one for **production** (built output). `package.json` points at the dev script by default; `publishConfig.bin` overrides for published packages.

## package.json Bin Configuration

```json
{
  "bin": { "pkg-placeholder": "./bin/index.dev.mjs" },
  "publishConfig": {
    "bin": { "pkg-placeholder": "./bin/index.mjs" }
  }
}
```

- **Development (local):** `bin` points to `bin/index.dev.mjs`, which runs the CLI from source via tsx (no build needed).
- **Published:** `publishConfig.bin` replaces `bin` on publish, so users get `bin/index.mjs` that runs the built `dist/cli/index.mjs`.

## Production Bin (bin/index.mjs)

```js
#!/usr/bin/env node
'use strict'

import '../dist/cli/index.mjs'
```

- **Shebang:** `#!/usr/bin/env node` so the system runs this file with Node.
- **Entry:** Imports the built CLI from `dist/cli/index.mjs` (output of tsdown from `src/cli/index.ts`).

## Development Bin (bin/index.dev.mjs)

```js
#!/usr/bin/env node
'use strict'

import { register } from 'tsx/esm/api'
const unregister = register()

await import('../src/cli/index.ts')
unregister()
```

- **tsx:** Registers tsx so TypeScript and ESM are supported without a build.
- **Entry:** Imports `src/cli/index.ts` directly; changes apply without running `pnpm build`.

## CLI Source (src/cli/index.ts)

Place CLI logic here (e.g. argument parsing with yargs/commander, then call library code from `src/index.ts`). Example:

```ts
function run(): void {
  console.log('Hello, world!')
  // Add CLI logic, e.g. yargs/commander
}
run()
```

## When to Use Which

- **Local development:** Use the default `bin` (index.dev.mjs) so `pnpm start` or `node bin/index.dev.mjs` run from source.
- **After publish:** Users get `bin/index.mjs` and run the built CLI; ensure `pnpm build` is run before publish (e.g. via `prepublishOnly`).

<!--
Source references:
- https://github.com/hairyf/starter-cli
-->

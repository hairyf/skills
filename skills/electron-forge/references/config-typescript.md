---
name: electron-forge-typescript-config
description: TypeScript Forge config — forge.config.ts, ForgeConfig, module constructor syntax.
---

# TypeScript configuration

As of Forge v7.8.1, `forge.config.ts` is loaded automatically via [jiti](https://github.com/unjs/jiti). No extra setup required. For older versions, use a loader compatible with [interpret](https://github.com/gulpjs/interpret) (e.g. `ts-node`).

## Basic forge.config.ts

Import types from `@electron-forge/shared-types`:

```typescript
import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
  packagerConfig: { asar: true, osxSign: {} },
  makers: [
    { name: '@electron-forge/maker-squirrel', platforms: ['win32'], config: { authors: 'Me' } },
    { name: '@electron-forge/maker-zip', platforms: ['darwin'], config: {} },
    { name: '@electron-forge/maker-deb', platforms: ['linux'], config: {} }
  ]
};

export default config;
```

## Module constructor syntax

For stronger typing per maker/publisher/plugin, use each module’s constructor: first argument is config, second is target platforms.

```typescript
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';

const config: ForgeConfig = {
  makers: [
    new MakerSquirrel({ authors: 'Me' }, ['win32']),
    new MakerZIP({}, ['darwin']),
    new MakerDeb({}, ['linux'])
  ]
};

export default config;
```

Other languages (e.g. CoffeeScript) are supported if a compatible loader is in `devDependencies` and interpret supports it; the structure matches `forge.config.js`.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/typescript-configuration.md
-->

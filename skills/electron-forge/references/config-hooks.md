---
name: electron-forge-hooks
description: Electron Forge hooks — generateAssets, preStart, postStart, prePackage, packageAfterCopy, postPackage, preMake, postMake, readPackageJson.
---

# Hooks

Hooks are async callbacks that run at specific points in the dev/build pipeline. Each hook receives the Forge config as the first argument. stdout/stderr from hooks are only shown when `DEBUG` or `CI` is set.

## Simple hooks (side effects only)

| Hook | When | Args (after config) |
|------|------|----------------------|
| `generateAssets` | Before `start` or `package` | `platform`, `arch` |
| `preStart` | Before app launches in dev | — |
| `postStart` | After app launched in dev | `appProcess` (ChildProcess) |
| `prePackage` | Before Electron Packager runs | `platform`, `arch` |
| `packageAfterCopy` | After packager copies app to temp dir | `buildPath`, `electronVersion`, `platform`, `arch` |
| `packageAfterPrune` | After packager prunes node_modules | same as above (no effect if `packagerConfig.prune === false`) |
| `packageAfterExtract` | After packager extracts Electron binary | same as above |
| `postPackage` | After package step completes | `packageResult` (`platform`, `arch`, `outputPaths`) |
| `preMake` | Before make step runs | — |

## Mutating hooks (return value is used)

| Hook | When | Return |
|------|------|--------|
| `postMake` | After make completes | Optional `MakeResult[]` to replace results for later steps (e.g. publish) |
| `readPackageJson` | Whenever Forge reads package.json | Optional modified `package.json` object |

## Examples

```javascript
module.exports = {
  hooks: {
    preStart: async (forgeConfig) => {
      console.log(`Starting on ${process.platform}`);
    },
    postPackage: async (forgeConfig, { outputPaths }) => {
      console.info('Packages at:', outputPaths);
    },
    readPackageJson: async (forgeConfig, packageJson) => {
      packageJson.version = '4.0.0';
      return packageJson;
    }
  }
};
```

**Note:** `readPackageJson` does not change the name/version used by Electron Packager for app metadata; those are read before this hook (in Packager’s `afterCopy`).

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/hooks.md
-->

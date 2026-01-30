---
name: electron-forge-makers-overview
description: Electron Forge makers — config, platforms; built-in makers (DMG, ZIP, Squirrel, deb, rpm, etc.).
---

# Makers overview

Makers turn the packaged app (from the Package step) into platform-specific distributables: installers (e.g. DMG, MSI, deb) or archives (ZIP). Configure them in the `makers` array in Forge config.

## Config shape

Each maker entry: `name` (required), optional `platforms` (e.g. `['darwin','linux']`), optional `config` (object or function `(arch) => config`).

```javascript
makers: [
  { name: '@electron-forge/maker-zip', platforms: ['darwin', 'linux'], config: {} },
  { name: '@electron-forge/maker-dmg', config: (arch) => ({ /* arch-specific */ }) }
]
```

If a maker supports multiple platforms, `platforms` limits which ones run; defaults are usually correct so it can be omitted.

## Built-in makers

| Maker | Typical platforms | Output |
|-------|-------------------|--------|
| `@electron-forge/maker-zip` | darwin, linux, win32 | ZIP |
| `@electron-forge/maker-dmg` | darwin | DMG |
| `@electron-forge/maker-squirrel` | win32 | Squirrel.Windows |
| `@electron-forge/maker-deb` | linux | .deb |
| `@electron-forge/maker-rpm` | linux | .rpm |
| `@electron-forge/maker-pkg` | darwin | .pkg |
| `@electron-forge/maker-wix` / `@electron-forge/maker-wix-msi` | win32 | MSI |
| `@electron-forge/maker-appx` | win32 | AppX |
| `@electron-forge/maker-msix` | win32 | MSIX |
| `@electron-forge/maker-snapcraft` | linux | Snap |
| `@electron-forge/maker-flatpak` | linux | Flatpak |

Install the maker package (e.g. `@electron-forge/maker-dmg`) as a devDependency and add its config to `makers`. To implement a custom maker, extend `@electron-forge/maker-base` and implement `isSupportedOnCurrentPlatform()` and `make()`. See [advanced-extending-makers](references/advanced-extending-makers.md).

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/makers/README.md
-->

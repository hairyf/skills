---
name: electron-forge-writing-makers
description: Writing Electron Forge makers — MakerBase, isSupportedOnCurrentPlatform, make.
---

# Writing makers

A maker is a class that extends `@electron-forge/maker-base`. It turns the packaged app (from the Package step) into one or more distributable artifacts. Install: `npm install @electron-forge/maker-base`.

## Required methods

### isSupportedOnCurrentPlatform(): boolean

Return whether the maker can run on the current machine (e.g. `process.platform`, or checks for tools like `fake-root`). If a dependency is missing, log a clear error explaining what to install.

```javascript
isSupportedOnCurrentPlatform() {
  return process.platform === 'linux' && this.isFakeRootInstalled();
}
```

### make(options: MakerOptions): Promise<string[]>

Perform the make step. `options` includes `dir`, `makeDir`, `appName`, `targetArch`, `packageJSON`, etc. (see [MakerOptions](https://js.electronforge.io/interfaces/_electron_forge_maker_base.MakerOptions.html)). Return an array of **absolute paths** to the generated artifacts. Throw or reject on error; Forge will stop the make process.

Maker config from Forge is available as `this.config`.

```javascript
async make(opts) {
  const pathToInstaller = await buildInstaller(opts.dir, opts.appName, this.config);
  return [pathToInstaller];
}
```

## Helper methods (MakerBase)

- `ensureDirectory(path)`: Create directory and empty it (destructive).
- `ensureFile(path)`: Ensure parent path exists and file is removed then recreated.
- `isInstalled(moduleName)`: Check if an optional dependency is installed.

See [MakerBase](https://js.electronforge.io/classes/_electron_forge_maker_base.MakerBase.html) for the full API.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/advanced/extending-electron-forge/writing-makers.md
-->

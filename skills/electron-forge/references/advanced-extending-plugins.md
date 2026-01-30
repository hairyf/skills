---
name: electron-forge-writing-plugins
description: Writing Electron Forge plugins — PluginBase, getHooks, startLogic.
---

# Writing plugins

A Forge plugin is a class that extends the base from `@electron-forge/plugin-base`. It can implement `getHooks()` and/or `startLogic()`; neither is required.

## getHooks(): ForgeMultiHookMap

Return an object mapping hook names to **arrays** of hook functions. Same hook names and signatures as in [config-hooks](references/config-hooks.md); Forge passes the resolved config and other args to each function.

```javascript
import PluginBase from '@electron-forge/plugin-base';

export default class MyPlugin extends PluginBase {
  getHooks() {
    return {
      prePackage: [this.prePackage.bind(this)]
    };
  }

  async prePackage() {
    console.log('running prePackage hook');
  }
}
```

Use this to run custom logic at package, make, or other lifecycle steps.

## startLogic(startOpts): Promise<ChildProcess | false>

Called when the user runs `electron-forge start`. If you return a **ChildProcess**, Forge uses it and does not spawn Electron itself (e.g. you start a dev server and then Electron). If you return **false**, Forge still spawns Electron but you can run setup first (e.g. compile, download binaries). Return nothing/undefined to use default start.

Overriding start applies only in **development**; to change how the app runs when packaged, use build hooks to inject or modify code.

```javascript
async startLogic(opts) {
  await this.compileMainProcess();
  return false; // Let Forge spawn Electron
}
```

`StartOptions` is documented in the [API](https://js.electronforge.io/interfaces/_electron_forge_shared_types.StartOptions.html).

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/advanced/extending-electron-forge/writing-plugins.md
-->

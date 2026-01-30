---
name: core-extension-entry
description: defineExtension, activate and deactivate in arch-vscode
---

# Extension Entry (defineExtension)

The extension entry uses **reactive-vscode**'s `defineExtension` to set up the extension. It returns `{ activate, deactivate }` which VSCode calls on load and unload.

## Usage

```ts
// src/index.ts
import { defineExtension } from 'reactive-vscode'
import { window } from 'vscode'

const { activate, deactivate } = defineExtension(() => {
  // Extension setup: register commands, watchers, disposables
  // reactive-vscode manages disposables when the extension is deactivated
  window.showInformationMessage('Hello')
})

export { activate, deactivate }
```

## Key Points

- **defineExtension(fn)** — `fn` runs when the extension activates. Return value is ignored; use the returned `{ activate, deactivate }` for the VSCode entry contract.
- **activate / deactivate** — Export these so `package.json` `main` (e.g. `./dist/index.cjs`) is the extension host entry; VSCode expects `activate` and optionally `deactivate`.
- **Disposables** — reactive-vscode wraps VSCode APIs in composables and tracks disposables; they are disposed on `deactivate`.
- **Single entry** — Only one entry file is built (`src/index.ts`); add commands and config in `config.ts` and `utils.ts` and import where needed.

## Adding Commands

Register commands inside `defineExtension` (or in a function it calls). Use `contributes.commands` in `package.json` and the generated meta for type-safe command IDs:

```ts
import { defineExtension } from 'reactive-vscode'
import { commands } from 'vscode'

const { activate, deactivate } = defineExtension(() => {
  commands.registerCommand('myExt.sayHello', () => {
    // ...
  })
})

export { activate, deactivate }
```

Ensure the command is listed in `package.json` under `contributes.commands` so it appears in the Command Palette and keybindings; `vscode-ext-gen` will then expose it in generated meta.

<!--
Source references:
- https://github.com/antfu/starter-vscode
- https://kermanx.com/reactive-vscode/
-->

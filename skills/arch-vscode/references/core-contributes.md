---
name: core-contributes
description: package.json contributes — commands, configuration, activationEvents
---

# package.json Contributes

VSCode extension behavior and metadata are declared in `package.json`: **main**, **engines**, **activationEvents**, and **contributes** (commands, configuration, etc.). The **vscode-ext-gen** tool reads these and generates `src/generated/meta.ts` for type-safe usage in code.

## Essential Fields

```json
{
  "main": "./dist/index.cjs",
  "engines": { "vscode": "^1.97.0" },
  "activationEvents": ["onStartupFinished"],
  "contributes": {
    "commands": [],
    "configuration": {
      "type": "object",
      "title": "ext-name",
      "properties": {}
    }
  }
}
```

| Field | Purpose |
|-------|--------|
| `main` | Entry file for the extension host; must export `activate` and optionally `deactivate`. |
| `engines.vscode` | Minimum VSCode version (semver). |
| `activationEvents` | When to activate: `onStartupFinished` activates after VSCode is ready; use `onCommand:...` for command-only activation. |
| `contributes.commands` | Command IDs and titles; appear in Command Palette and keybindings. |
| `contributes.configuration` | Settings under the extension's title; used by `defineConfig` and generated meta. |

## Adding Commands

```json
"contributes": {
  "commands": [
    {
      "command": "myExt.sayHello",
      "title": "Say Hello"
    }
  ]
}
```

Then run `pnpm update` so generated meta includes the command ID (e.g. for type-safe `commands.registerCommand`).

## Adding Configuration

```json
"contributes": {
  "configuration": {
    "type": "object",
    "title": "My Extension",
    "properties": {
      "myExt.enableFeature": {
        "type": "boolean",
        "default": true,
        "description": "Enable the feature"
      }
    }
  }
}
```

After `pnpm update`, `config.get('myExt.enableFeature')` (or the reactive equivalent) is typed via generated meta.

## Activation Events

- **onStartupFinished** — Activate when VSCode has finished starting. Use for extensions that run globally.
- **onCommand:commandId** — Activate only when the command is invoked. Prefer for lightweight extensions that only respond to commands.

## Key Points

- Always run **pnpm update** after changing `contributes` so `src/generated/meta.ts` and TypeScript stay in sync.
- Use **Run on Save** (e.g. emeraldwalk.runonsave) to run `npm run update` on `package.json` save if you want meta to regenerate automatically.

<!--
Source references:
- https://github.com/antfu/starter-vscode
- https://code.visualstudio.com/api/references/contribution-points
-->

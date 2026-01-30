---
name: electron-forge-debugging
description: Debugging Electron Forge apps — main process (CLI, VS Code, JetBrains), renderer DevTools.
---

# Debugging

Renderer processes use Chromium DevTools. The main process is debugged via Node inspector flags or your IDE. This covers Forge-specific ways to debug the main process; assume `"start": "electron-forge start"` in package.json.

## Command line

Run start with `--inspect-electron` so the main process listens for a debugger on port 5858:

```bash
npm run start -- --inspect-electron
```

Open `chrome://inspect` in a Chromium-based browser and attach to the main process. Use `--inspect-brk-electron` to break on the first line of execution.

## VS Code

Add a Node.js launch config that runs the Forge script so the main process is started under the debugger:

```json
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Electron Main",
      "runtimeExecutable": "${workspaceFolder}/node_modules/@electron-forge/cli/script/vscode.sh",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/@electron-forge/cli/script/vscode.cmd"
      },
      "runtimeArgs": ["foo", "bar"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

Use Run and Debug to start; `runtimeArgs` are passed to the Electron app.

## WebStorm / JetBrains

Use **Run > Debug… > Edit Configurations…**, add an npm configuration, choose the `start` script, then run Debug. The main process will be debuggable from the IDE.

For general Electron debugging (renderer, preload), see the [Electron Application Debugging](https://www.electronjs.org/docs/latest/tutorial/application-debugging#renderer-process) docs.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/advanced/debugging.md
-->

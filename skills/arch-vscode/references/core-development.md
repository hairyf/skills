---
name: core-development
description: Extension Host debugging — launch.json, tasks.json, run on save
---

# Development and Debugging

Develop and debug the extension using **Extension Host** launch config, a **watch** build task, and optional **Run on Save** to keep generated meta in sync.

## Launch (Extension Host)

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension",
      "type": "extensionHost",
      "request": "launch",
      "runtimeExecutable": "${execPath}",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "preLaunchTask": "npm: dev"
    }
  ]
}
```

- **extensionHost** — Starts a new VSCode window with your extension loaded.
- **preLaunchTask** — Runs `npm: dev` (watch build) so `dist/` is up to date before launch.
- **outFiles** — Enables breakpoints in `dist/**/*.js` (and sourcemaps from `dev`).

## Tasks (Watch Build)

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "dev",
      "isBackground": true,
      "presentation": { "reveal": "never" },
      "problemMatcher": [
        {
          "base": "$tsc-watch",
          "background": {
            "activeOnStart": true,
            "beginsPattern": "Build start",
            "endsPattern": "(B|Reb)uild complete|Rebuilt in"
          }
        }
      ],
      "group": "build"
    }
  ]
}
```

- **dev** — `pnpm dev` (tsdown watch + sourcemap).
- **isBackground** + **problemMatcher** — Lets the launch config wait until the first build finishes (begins/ends patterns match tsdown output).

## Run on Save (Optional)

```json
// .vscode/settings.json (excerpt)
"emeraldwalk.runonsave": {
  "commands": [
    { "match": "package.json", "isAsync": true, "cmd": "npm run update" }
  ]
}
```

When `package.json` is saved, `npm run update` runs so `src/generated/meta.ts` is regenerated. Requires the **Run on Save** extension (recommended in `.vscode/extensions.json`).

## Workflow

1. Run **Extension** from the Run and Debug view (or F5).
2. preLaunchTask starts **dev** (watch); wait for first build to complete.
3. A new VSCode window opens with your extension loaded; set breakpoints in `src/` (sourcemaps map back to TypeScript).
4. After changing `package.json` contributes, save so Run on Save runs `update`, or run `pnpm update` manually.

## Key Points

- Use **Extension** launch only; it depends on the **dev** task.
- If the dev task doesn’t complete, check that the problemMatcher **beginsPattern** / **endsPattern** match your tsdown version’s console output.
- **extensions.json** can recommend **amodio.tsl-problem-matcher** and **emeraldwalk.runonsave** for a smoother experience.

<!--
Source references:
- https://github.com/antfu/starter-vscode
- https://code.visualstudio.com/api/working-with-extensions/testing-extension
-->

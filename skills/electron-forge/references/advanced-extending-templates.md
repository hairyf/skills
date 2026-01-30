---
name: electron-forge-writing-templates
description: Writing Electron Forge templates — ForgeTemplate interface, requiredForgeVersion, initializeTemplate.
---

# Writing templates

Templates provide the initial project structure and dependencies when users run `electron-forge init` or `create-electron-app`. A template implements the **ForgeTemplate** interface.

## ForgeTemplate interface

- **requiredForgeVersion** _(required)_: Semver range of Forge versions supported (e.g. `^6.0.0-beta.1`).
- **dependencies** _(optional)_: Array of package specifiers for `dependencies` (e.g. `['jquery', 'lodash@^4.0.0']`).
- **devDependencies** _(optional)_: Array of package specifiers for `devDependencies` (e.g. `['eslint@^7.0.0']`).
- **initializeTemplate** _(optional)_: Async function that runs after the template is selected; e.g. copy files from a `tmpl` folder into the new app. The signature is defined in `@electron-forge/shared-types`.

## Using a custom template

Users run the [init](references/core-cli.md) command and pass the template (e.g. path or package name). The template must be resolvable when init runs (e.g. installed globally or referenced by path).

```bash
npx electron-forge init --template=my-forge-template
```

For full details on the interface and `initializeTemplate` signature, see the shared types package and the [writing-templates](https://github.com/electron-forge/electron-forge-docs/blob/main/advanced/extending-electron-forge/writing-templates.md) doc.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/advanced/extending-electron-forge/writing-templates.md
-->

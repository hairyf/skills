---
name: electron-forge-writing-publishers
description: Writing Electron Forge publishers — PublisherBase, publish.
---

# Writing publishers

A publisher is a class that extends `@electron-forge/publisher-base`. It takes Make step artifacts and uploads them (e.g. to GitHub Releases or S3). Install: `npm install @electron-forge/publisher-base`.

## Required method: publish(options: PublisherOptions): Promise<void>

Perform the upload. `options` includes `makeResults`, `dir`, `packageJSON`, etc. (see [PublisherOptions](https://js.electronforge.io/interfaces/_electron_forge_publisher_base.PublisherOptions.html)). On failure, **throw** (or reject); do not fail silently or only log, or Forge will not report the error.

Publisher config from Forge is on `this.config`.

**Important:** Forge calls `publish` once per (platform, arch) combination for a given version. For a single version with darwin and win32, you get two calls; the first might create the release, the second adds more files. Your implementation must handle multiple calls (e.g. create release on first call, append artifacts on subsequent calls).

```javascript
import PublisherBase from '@electron-forge/publisher-base';

export default class MyPublisher extends PublisherBase {
  async publish(opts) {
    for (const result of opts.makeResults) {
      await this.ensureVersionExists(opts);
      await this.uploadArtifacts(result);
    }
  }
}
```

See [PublisherBase](https://js.electronforge.io/modules/_electron_forge_publisher_base.html) for the full API.

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/advanced/extending-electron-forge/writing-publishers.md
-->

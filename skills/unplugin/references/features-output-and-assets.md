---
name: unplugin-output-and-assets
description: this.emitFile (EmittedAsset only) and writeBundle (timing only); webpack caveats.
---

# Unplugin Output and Assets

## this.emitFile

Unplugin supports only the **EmittedAsset** variant of Rollup’s `emitFile`. You can emit static assets (e.g. generated JSON, text, or binary) that the bundler will write to the output directory.

### Shape

```ts
this.emitFile({
  type: 'asset',
  fileName?: string,   // output path relative to outdir
  name?: string,       // optional chunk/file name hint
  source: string | Uint8Array,
})
```

`EmittedChunk` (virtual chunks) is **not** supported. Use `type: 'asset'` only.

### Where emitFile is allowed

- **webpack**: Only inside `buildStart`, `buildEnd`, `load`, `transform`, and `watchChange`. Calling `emitFile` from other hooks can throw.
- Other bundlers: typically any hook that receives the build context.

## writeBundle

`writeBundle` is a **timing** hook only: it runs after the bundle has been written. It receives **no arguments**. Use it for post-build steps (e.g. copying files, generating a manifest), not for reading bundle paths or content from the hook signature.

```ts
createUnplugin(() => ({
  name: 'my-plugin',
  writeBundle() {
    // No arguments; run post-build logic here
    generateManifest()
  },
}))
```

**Bun**: `writeBundle` (and `buildEnd`) are not supported; Bun’s plugin API has no `onEnd` hook yet.

<!--
Source references:
- sources/unplugin/docs/guide/index.md (writeBundle notice, this.emitFile notice)
- sources/unplugin/src/types.ts (EmittedAsset)
- sources/unplugin/src/webpack/context.ts (emitFile hook check)
-->

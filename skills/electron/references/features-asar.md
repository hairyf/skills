---
name: features-asar
description: ASAR archives — pack/unpack, Node and Web API usage, unpack option, and integrity (fuses).
---

# ASAR Archives

ASAR is a simple archive format for Electron apps. Bundling the app into a single `app.asar` improves `require` performance, avoids long path issues on Windows, and obscures source code from casual inspection. Electron treats an asar file as a virtual directory; most Node and Web APIs work without change.

## Using ASAR

- **Node:** `fs.readFile`, `fs.readdirSync`, `require()` treat `path/to/app.asar/file` as a normal file/directory. Use `path.join(__dirname, 'app.asar', 'subpath')` when your app is packaged.
- **Web:** Loading with `file://` (e.g. `win.loadURL('file:///path/to/app.asar/index.html')`) works; fetch and XHR to file paths inside the asar work.
- **Packaging:** Use [`@electron/asar`](https://github.com/electron/asar) to pack: `asar pack app app.asar`. Place `app.asar` in the Electron resources directory (see [distribute-packaging](references/distribute-packaging.md)).

## Unpacking

Some Node APIs or native modules need real files on disk. Unpack specific files or directories by listing them in the `unpack` option when packing (e.g. `asar pack app app.asar --unpack "*.node"`). Unpacked files appear next to the asar in an `app.asar.unpacked` directory. Use `app.getAppPath()` and the same path logic so both dev (unpacked app folder) and packaged (asar + unpacked) work.

## Integrity

To validate asar contents at load time, use the **embeddedAsarIntegrityValidation** fuse (see [features-fuses](references/features-fuses.md)). With **onlyLoadAppFromAsar**, Electron loads only from `app.asar` (no unpacked `app` folder), strengthening integrity when combined with validation.

## Key points

- **Node/Web:** Use normal paths into `app.asar`; `require` and `fs` work. Use **unpack** for files that must be on disk (e.g. native modules).
- **Pack:** Use `@electron/asar`; put `app.asar` in resources. Use **onlyLoadAppFromAsar** and **embeddedAsarIntegrityValidation** fuses for stricter integrity.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/asar-archives.md
- https://www.electronjs.org/docs/latest/tutorial/asar-archives
- https://github.com/electron/asar
-->

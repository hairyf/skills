---
name: develop-safe-storage
description: safeStorage — encryptString, decryptString; OS keychain (macOS/Windows/Linux).
---

# Safe Storage

The `safeStorage` module (main process) encrypts and decrypts strings using OS-backed secrets: macOS Keychain, Windows DPAPI, or a Linux secret store (e.g. libsecret, KWallet). Use it to store tokens, API keys, or other sensitive data on disk without plaintext.

## Availability

- **safeStorage.isEncryptionAvailable()** — Returns `true` when encryption is available. On macOS: Keychain available; on Windows: after `ready`; on Linux: after `ready` and a secret store is available. Check before calling encrypt/decrypt.
- On Linux, if no secret store is available, data may fall back to a hardcoded password (unprotected). **safeStorage.getSelectedStorageBackend()** (Linux) returns the backend (e.g. `gnome_libsecret`, `kwallet5`, `basic_text`). If it returns `basic_text`, encryption is not truly secure.

## Encrypt and decrypt

- **safeStorage.encryptString(plainText)** — Returns a **Buffer** of encrypted bytes. Throws if encryption fails. Store this buffer (e.g. write to a file or store in your app’s data).
- **safeStorage.decryptString(encrypted)** — Pass the Buffer from **encryptString**; returns the original string. Throws if decryption fails.

```js
const { safeStorage } = require('electron')
const fs = require('node:fs')
const path = require('node:path')

if (safeStorage.isEncryptionAvailable()) {
  const encrypted = safeStorage.encryptString('secret-token')
  fs.writeFileSync(path.join(app.getPath('userData'), 'token.bin'), encrypted)
}

// Later
const buf = fs.readFileSync(path.join(app.getPath('userData'), 'token.bin'))
const token = safeStorage.decryptString(buf)
```

Only strings are supported; serialize other data (e.g. JSON) to a string before encrypting.

## Platform notes

- **macOS:** Uses Keychain; may block for user interaction (e.g. unlock Keychain). Ensure Keychain access is allowed for your app.
- **Windows:** Uses DPAPI; data is per-user; other apps in the same user session can potentially access the same key in some scenarios.
- **Linux:** Backend depends on the desktop (libsecret, KWallet). Use **getSelectedStorageBackend()** to see which is used; **basic_text** means no real secret store.

## Key points

- Use **isEncryptionAvailable()** before **encryptString** / **decryptString**. Use **encryptString** for secrets you write to disk; use **decryptString** when reading.
- On **Linux** check **getSelectedStorageBackend()**; avoid relying on safe storage when it returns **basic_text**.
- Main process only; expose encrypt/decrypt via IPC from preload if the renderer needs to store/retrieve secrets (prefer doing it in main and returning results).

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/api/safe-storage.md
- https://www.electronjs.org/docs/latest/api/safe-storage
-->

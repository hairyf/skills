---
name: arch-webext-vue-storage
description: useWebExtensionStorage composable and shared storage logic in the Vitesse WebExtension template.
---

# Extension Storage

The template uses **webextension-polyfill** `storage` API with a Vue-friendly composable **useWebExtensionStorage** in `src/composables/useWebExtensionStorage.ts`. It mirrors VueUse’s `useStorageAsync` contract but backs storage with `browser.storage.local`. Use it in popup, options, or sidepanel to persist reactive state across sessions and to sync state between those views.

## Composable API

```ts
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

const { data, dataReady } = useWebExtensionStorage('storage-key', initialValue, options?)
```

- **key**: String key for `storage.local`.
- **initialValue**: Default value (can be ref/getter); used when key is missing; type is inferred for (de)serialization.
- **options**: Optional; same shape as VueUse `useStorageAsync` (e.g. `flush`, `deep`, `listenToStorageChanges`, `writeDefaults`, `mergeDefaults`, `shallow`, `onError`).
- **Returns**: `{ data: RemovableRef<T>, dataReady: Promise<T> }`. `data` is reactive; writes are persisted to storage; `dataReady` resolves when initial read (and optional default write) is done.

## Serialization

The composable uses VueUse’s `StorageSerializers` and a custom `guessSerializerType` for types: `any`, `set`, `map`, `date`, `boolean`, `string`, `object`, `number`. Stored value is stringified; other tabs/contexts that use the same key will see updates if `listenToStorageChanges` is true (default).

## Shared Logic Layer

Example in `src/logic/storage.ts`:

```ts
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
export const { data: storageDemo, dataReady: storageDemoReady } = useWebExtensionStorage('webext-demo', 'Storage Demo')
```

Views (popup, options) import `storageDemo` and `storageDemoReady` from `~/logic/storage` so the same key is used in one place and state is shared across UI.

## Implementation Notes

- Backing is `storage.local` (get/set/remove); the composable implements `StorageLikeAsync` for VueUse.
- `storage.onChanged.addListener` is used when `listenToStorageChanges` is true so other tabs/contexts updating the same key update the local ref.
- Use `dataReady` before rendering or before assuming `data` has been hydrated from storage.

## Key Points

- Prefer defining shared keys in `~/logic/storage.ts` (or similar) and re-exporting `data`/`dataReady` so popup and options stay in sync.
- For complex objects, the default serializer is JSON; use options.serializer for custom (de)serialization if needed.
- Content script can also use the same composable if it runs in a context that has access to extension storage.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (src/composables/useWebExtensionStorage.ts, src/logic/storage.ts)
-->

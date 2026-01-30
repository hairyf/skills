---
name: arch-webext-vue-testing
description: Unit tests (Vitest) and E2E tests (Playwright) in the Vitesse WebExtension template.
---

# Testing

The template uses **Vitest** for unit tests and **Playwright** for E2E tests that load the built extension and drive the browser. Unit tests live next to source or in `src/tests/`; E2E tests and fixtures live in **e2e/**.

## Unit Tests (Vitest)

- **Config**: Vite shared config includes `test: { globals: true, environment: 'jsdom' }`; run with `pnpm test` (or `vitest`).
- **Locations**:
  - `src/tests/demo.spec.ts` — generic sanity test.
  - `src/components/__tests__/Logo.test.ts` — component test using `@vue/test-utils` `mount(Logo)`.
- **Pattern**: Use `describe`/`it`, `expect`; for Vue components import and mount the component, then assert on `wrapper.html()` or `wrapper.find()`.

```ts
// src/components/__tests__/Logo.test.ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Logo from '../Logo.vue'

describe('logo component', () => {
  it('should render', () => {
    const wrapper = mount(Logo)
    expect(wrapper.html()).toBeTruthy()
  })
})
```

Vitest uses the same Vite config (root `src/`), so `~/` and auto-imports work in tests.

## E2E Tests (Playwright)

- **Config**: `playwright.config.ts` — `testDir: './e2e'`, `webServer: { command: 'npm run dev', url: 'http://localhost:3303/popup/main.ts', reuseExistingServer: true }`. E2E runs against the built extension loaded in a real browser; the web server ensures dev is up so the extension can load Vite assets.
- **Fixtures** (`e2e/fixtures.ts`):
  - **extensionPath**: `path.join(__dirname, '../extension')` — the unpacked extension directory.
  - **context**: Chromium persistent context with `--disable-extensions-except=${extensionPath}` and `--load-extension=${extensionPath}`; includes a short sleep so Vite and content script are ready.
  - **extensionId**: Resolved from the first service worker URL (MV3) so tests can open `chrome-extension://${extensionId}/dist/popup/index.html` etc.
  - **isDevArtifact()**: Reads `extension/manifest.json` and checks if CSP `extension_pages` includes `localhost` (dev build). Used to skip tests that require dev-only behavior (e.g. content script in open Shadow DOM).
- **Tests** (`e2e/basic.spec.ts`):
  - Example content script: goto example.com, click button inside `#${name}`, assert h1; skipped when not dev artifact (closed shadow root).
  - Popup: goto `chrome-extension://${extensionId}/dist/popup/index.html`, assert button text.
  - Options: goto options page, assert img alt.

Run E2E with `pnpm test:e2e` (playwright test). Ensure `pnpm dev` has been run at least once so `extension/` is populated, or run a full build first.

## Key Points

- Unit tests use Vitest + jsdom; Vue components use @vue/test-utils. Place tests in `src/tests/` or `__tests__` next to components.
- E2E loads the real extension from `extension/`; fixtures provide `extensionId` and `context`; use `extensionPath` if you need to assert on built files.
- Skip content-script E2E when not in dev (e.g. closed shadow root) via `testInfo.skip(!isDevArtifact(), '...')`.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-webext (e2e/, src/tests/, src/components/__tests__/, playwright.config.ts, vite.config.mts)
-->

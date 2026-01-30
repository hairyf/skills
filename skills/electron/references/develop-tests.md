---
name: develop-tests
description: Automated testing for Electron — WebDriver/WebdriverIO, E2E, and headless CI.
---

# Automated Testing

Electron does not ship a built-in test runner. Use WebDriver-based E2E tests (e.g. WebdriverIO) or other test frameworks that launch and drive your app.

## WebDriver and WebdriverIO

ChromeDriver (and compatible drivers) implement the WebDriver protocol for Chromium. You can drive an Electron app by connecting a WebDriver client to it.

### WebdriverIO (WDIO)

WebdriverIO supports Electron via the `electron` service. Use it to run E2E tests against your packaged or dev app.

1. **Install and configure:** Run `npm init wdio@latest ./` and choose "Desktop Testing - of Electron Applications" when prompted.
2. **Configure `wdio.conf.js`:** Set `services: ['electron']` and `capabilities` with `browserName: 'electron'` and `wdio:electronServiceOptions` (e.g. `appBinaryPath`, `appArgs`).
3. **Write tests:** Use WDIO APIs (`browser`, `$`, `expect`) to interact with the UI. You can also call Electron APIs from tests via `browser.electron.execute((electron, ...args) => { ... }, ...args)`.
4. **Run:** Execute your test script (e.g. `npx wdio run wdio.conf.js`).

```js
// Example test
import { browser, $, expect } from '@wdio/globals'
it('should detect keyboard input', async () => {
  await browser.keys(['y', 'o'])
  await expect($('keypress-count')).toHaveText('YO')
})
```

If you use Electron Forge or electron-builder, WDIO can discover the bundled app; otherwise set `appBinaryPath` to your executable.

## Headless CI

To run tests in CI without a display:

- **Linux:** Use a virtual framebuffer (e.g. `xvfb-run`) or a headless Chromium/Electron mode if your test stack supports it.
- **Windows/macOS:** Use the CI provider’s headless or virtual display support.

See the [testing-on-headless-ci](https://www.electronjs.org/docs/latest/tutorial/testing-on-headless-ci) tutorial for examples and caveats.

## Key points

- Use WebDriver (e.g. WebdriverIO with the Electron service) to automate and assert on your Electron UI.
- Expose only the app binary and args you need; use `browser.electron.execute` when you need to trigger main-process behavior from tests.
- In CI, run with a virtual display (e.g. xvfb) or headless where supported.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/automated-testing.md
- https://www.electronjs.org/docs/latest/tutorial/automated-testing
- https://github.com/electron/electron/blob/main/docs/tutorial/testing-on-headless-ci.md
-->

---
name: features-testing
description: Vitest unit and component tests in arch-nuxt-lite
---

# Testing (Vitest)

Vitest is configured in `vite.config.ts` with `test.environment: 'jsdom'`. Use it for unit tests and component tests with `@vue/test-utils`.

## Usage

**Unit test** — `test/basic.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

describe('hi', () => {
  it('should works', () => {
    expect(1 + 1).toEqual(2)
  })
})
```

**Component test** — `test/component.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheCounter from '../src/components/TheCounter.vue'

describe('component of TheCounter.vue', () => {
  it('should render', () => {
    const wrapper = mount(TheCounter, { props: { initial: 10 } })
    expect(wrapper.text()).toContain('10')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be interactive', async () => {
    const wrapper = mount(TheCounter, { props: { initial: 0 } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('1')
  })
})
```

Run tests with `pnpm test` (Vitest).

## Key points

- Vitest shares Vite config; no separate config file unless you need one.
- Use `mount()` from `@vue/test-utils` for components; composables like `useCounter` are resolved via auto-import in the app, so the component under test uses them as in the app.
- Snapshots are stored in `test/__snapshots__/`; commit them if you use snapshot tests.

<!--
Source references:
- https://github.com/antfu-collective/vitesse-lite
- https://vitest.dev
-->

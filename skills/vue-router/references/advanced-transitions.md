---
name: advanced-transitions
description: Route transitions using RouterView slot, per-route transitions, and dynamic transitions based on route depth
---

# Transitions

Animate route changes using Vue's transition system.

## Basic Transition

Use RouterView slot with `<Transition>`:

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
```

All Vue transition APIs work the same way.

## Per-Route Transition

Use route meta to specify different transitions:

```js
const routes = [
  {
    path: '/custom-transition',
    component: PanelLeft,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/other-transition',
    component: PanelRight,
    meta: { transition: 'slide-right' },
  },
]
```

```vue
<RouterView v-slot="{ Component, route }">
  <Transition :name="route.meta.transition || 'fade'">
    <component :is="Component" />
  </Transition>
</RouterView>
```

## Route-Based Dynamic Transition

Determine transition based on route relationship:

```js
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```

```vue
<RouterView v-slot="{ Component, route }">
  <Transition :name="route.meta.transition">
    <component :is="Component" />
  </Transition>
</RouterView>
```

## Forcing Transitions

Add `key` attribute to force transitions between reused components:

```vue
<RouterView v-slot="{ Component, route }">
  <Transition name="fade">
    <component :is="Component" :key="route.path" />
  </Transition>
</RouterView>
```

This also triggers transitions when staying on same route with different params.

## Initial Navigation

Transitions always apply on initial navigation. To prevent, await router ready:

```ts
const app = createApp(App)
app.use(router)

await router.isReady() // Wait for initial navigation
app.mount('#app')
```

## Key Points

- Use RouterView slot with Transition component
- Access route via slot props for dynamic transitions
- Use route meta to specify per-route transitions
- Add `key` attribute to force transitions on reused components
- Await `router.isReady()` to control initial transition

<!--
Source references:
- https://router.vuejs.org/guide/advanced/transitions.html
-->

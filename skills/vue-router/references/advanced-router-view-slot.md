---
name: advanced-router-view-slot
description: RouterView slot API for custom rendering, KeepAlive, transitions, passing props, and template refs
---

# RouterView Slot

Use RouterView slot API for advanced rendering scenarios.

## Basic Slot Usage

RouterView exposes slot for custom rendering:

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" />
</RouterView>
```

This is equivalent to `<RouterView />` but provides flexibility.

## KeepAlive

Keep route components alive:

```vue
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <component :is="Component" />
  </KeepAlive>
</RouterView>
```

## Transitions

Add transitions between routes:

```vue
<RouterView v-slot="{ Component }">
  <Transition name="fade">
    <component :is="Component" />
  </Transition>
</RouterView>
```

## KeepAlive with Transition

Combine both:

```vue
<RouterView v-slot="{ Component }">
  <Transition>
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </Transition>
</RouterView>
```

## Passing Props and Slots

Pass props or slots to route components:

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" some-prop="value">
    <p>Slotted content</p>
  </component>
</RouterView>
```

**Warning**: This applies to all route components, which may not be desired. Prefer route-level props.

## Template Refs

Put template ref directly on route component:

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" ref="mainContent" />
</RouterView>
```

If ref is on `<RouterView>` instead, it references RouterView instance, not route component.

## Slot Props

Slot provides:
- `Component`: The route component to render
- `route`: Current route object (when accessing route in slot)

```vue
<RouterView v-slot="{ Component, route }">
  <Transition :name="route.meta.transition">
    <component :is="Component" />
  </Transition>
</RouterView>
```

## Key Points

- Use slot API for custom rendering scenarios
- Combine with KeepAlive and Transition components
- Access route via slot props for dynamic behavior
- Template refs on component reference route component, not RouterView
- Prefer route-level props over slot props when possible

<!--
Source references:
- https://router.vuejs.org/guide/advanced/router-view-slot.html
-->

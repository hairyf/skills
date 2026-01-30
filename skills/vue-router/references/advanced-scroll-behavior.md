---
name: advanced-scroll-behavior
description: Custom scroll behavior on navigation, scroll to top, preserve scroll position, and scroll to anchor
---

# Scroll Behavior

Customize scroll position when navigating between routes.

## Basic Scroll Behavior

Define `scrollBehavior` function when creating router:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [...],
  scrollBehavior(to, from, savedPosition) {
    // Return desired scroll position
  },
})
```

Function receives:
- `to`: Target route
- `from`: Current route
- `savedPosition`: Position from browser history (back/forward buttons)

## Scroll to Top

Always scroll to top:

```js
scrollBehavior() {
  return { top: 0 }
}
```

## Scroll to Element

Scroll to specific element with offset:

```js
scrollBehavior(to, from, savedPosition) {
  return {
    el: '#main', // CSS selector or DOM element
    top: 10,     // Offset from element
  }
}
```

## Preserve Scroll Position

Return `savedPosition` for native-like behavior:

```js
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { top: 0 }
  }
}
```

## Scroll to Hash

Scroll to anchor in URL:

```js
scrollBehavior(to, from, savedPosition) {
  if (to.hash) {
    return {
      el: to.hash,
      behavior: 'smooth', // Smooth scrolling
    }
  }
}
```

## Delayed Scroll

Return Promise to delay scroll (e.g., wait for transition):

```js
scrollBehavior(to, from, savedPosition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ top: 0 })
    }, 500)
  })
}
```

## Advanced Offsets

Calculate dynamic offsets:

```js
scrollBehavior(to, from, savedPosition) {
  const mainElement = document.querySelector('#main')
  if (mainElement) {
    const marginTop = parseFloat(
      getComputedStyle(mainElement).scrollMarginTop
    )
    return {
      el: mainElement,
      top: marginTop,
    }
  }
  return { top: 0 }
}
```

## Key Points

- Define `scrollBehavior` function in router config
- Return `ScrollToOptions` object or Promise
- Use `savedPosition` for back/forward button behavior
- Return `{ el: selector }` to scroll to element
- Return Promise to delay scroll (e.g., for transitions)

<!--
Source references:
- https://router.vuejs.org/guide/advanced/scroll-behavior.html
-->

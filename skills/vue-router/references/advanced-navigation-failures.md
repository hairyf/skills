---
name: advanced-navigation-failures
description: Detecting navigation failures, handling aborted/cancelled/duplicated navigations, and checking navigation results
---

# Navigation Failures

Handle cases where navigation is prevented or fails.

## Detecting Navigation Failures

Navigation methods return promises. If navigation is prevented, promise resolves to Navigation Failure:

```js
const navigationResult = await router.push('/my-profile')

if (navigationResult) {
  // Navigation prevented - Navigation Failure object
} else {
  // Navigation succeeded (including redirections)
}
```

## Checking Failure Type

Use `isNavigationFailure` to check failure type:

```js
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // Navigation was aborted
}
```

Omit second parameter to check if it's any navigation failure:

```js
if (isNavigationFailure(failure)) {
  // Any type of navigation failure
}
```

## Failure Types

Three types of navigation failures:

- `NavigationFailureType.aborted`: Guard returned `false`
- `NavigationFailureType.cancelled`: New navigation started before current finished
- `NavigationFailureType.duplicated`: Already at target location

## Failure Properties

Navigation failures expose `to` and `from` properties:

```js
const failure = await router.push('/admin')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  failure.to.path   // '/admin' - target location
  failure.from.path // '/' - current location
}
```

## Global Failure Detection

Detect failures globally with `afterEach`:

```ts
router.afterEach((to, from, failure) => {
  if (failure) {
    sendToAnalytics(to, from, failure)
  }
})
```

## Detecting Redirections

Redirections don't prevent navigation - they create new navigation. Check `redirectedFrom`:

```js
await router.push('/my-profile')

if (router.currentRoute.value.redirectedFrom) {
  // Navigation was redirected
  console.log(router.currentRoute.value.redirectedFrom.path)
}
```

## Common Scenarios

Navigation can be prevented when:
- User already on target page
- Guard returns `false`
- New navigation starts before current finishes
- Guard redirects elsewhere
- Guard throws error

## Key Points

- Navigation methods return promises
- Falsy result = success, truthy result = Navigation Failure
- Use `isNavigationFailure()` to check failure type
- Check `redirectedFrom` to detect redirections
- Access `to` and `from` on failure objects

<!--
Source references:
- https://router.vuejs.org/guide/advanced/navigation-failures.html
-->

---
name: advanced-composition-api
description: Using Vue Router with Composition API - useRouter, useRoute, navigation guards, and useLink composable
---

# Vue Router and Composition API

Use Vue Router with Composition API using composables.

## Accessing Router and Route

Use `useRouter()` and `useRoute()` composables:

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function navigate() {
  router.push({ name: 'search', query: { ...route.query, ...newQuery } })
}
</script>
```

## Watching Route Properties

Watch specific properties, not the whole route object:

```vue
<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userData = ref()

watch(
  () => route.params.id,
  async newId => {
    userData.value = await fetchUser(newId)
  }
)
```

## Navigation Guards

Use Composition API guards:

```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('Leave with unsaved changes?')
  if (!answer) return false
})

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    userData.value = await fetchUser(to.params.id)
  }
})
</script>
```

Composition API guards can be used in any component rendered by `<RouterView>`, not just route components.

## useLink Composable

Access RouterLink internal behavior:

```vue
<script setup>
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  ...RouterLink.props,
  inactiveClass: String,
})

const {
  route,        // Resolved route object
  href,          // Href for link
  isActive,      // Boolean ref - is link active
  isExactActive, // Boolean ref - is link exactly active
  navigate,      // Function to navigate
} = useLink(props)

const isExternalLink = computed(
  () => typeof props.to === 'string' && props.to.startsWith('http')
)
</script>
```

Useful for building custom link components. RouterLink's `v-slot` provides same properties.

## Key Points

- Use `useRouter()` for navigation, `useRoute()` for current route
- Watch specific route properties, not whole route object
- Use `onBeforeRouteUpdate` and `onBeforeRouteLeave` for guards
- `useLink` provides RouterLink internals for custom components
- Guards can be used in any component, not just route components

<!--
Source references:
- https://router.vuejs.org/guide/advanced/composition-api.html
-->

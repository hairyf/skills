---
name: Activity
description: React component for hiding and restoring UI state without unmounting
---

# Activity

`<Activity>` lets you hide and restore the UI and internal state of its children without unmounting them. Useful for preserving component state when temporarily hiding content.

## Usage

```js
import { Activity } from 'react';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  
  return (
    <>
      <button onClick={() => setShowSidebar(!showSidebar)}>
        Toggle Sidebar
      </button>
      <Activity mode={showSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>
    </>
  );
}
```

### Basic structure

```js
<Activity mode="visible" | "hidden">
  {children}
</Activity>
```

- `mode`: `'visible'` or `'hidden'`
- `children`: Components to show/hide

## Key Points

- **Preserves state**: Component state is preserved when hidden
- **Destroys Effects**: Effects are cleaned up when hidden, recreated when visible
- **Lower priority**: Hidden components render at lower priority
- **CSS display**: Uses `display: none` to hide

## Common Patterns

### Preserving sidebar state

```js
function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  
  return (
    <>
      <button onClick={() => setShowSidebar(!showSidebar)}>
        {showSidebar ? 'Hide' : 'Show'} Sidebar
      </button>
      <Activity mode={showSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>
    </>
  );
}
```

### Tab content with preserved state

```js
function TabContainer() {
  const [activeTab, setActiveTab] = useState('tab1');
  
  return (
    <>
      <Tabs activeTab={activeTab} onChange={setActiveTab} />
      <Activity mode={activeTab === 'tab1' ? 'visible' : 'hidden'}>
        <Tab1Content />
      </Activity>
      <Activity mode={activeTab === 'tab2' ? 'visible' : 'hidden'}>
        <Tab2Content />
      </Activity>
    </>
  );
}
```

## Differences from conditional rendering

```js
// ❌ Unmounts component, loses state
{showSidebar && <Sidebar />}

// ✅ Preserves state when hidden
<Activity mode={showSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

## When to use Activity

Use `<Activity>` when:
- Need to preserve component state when hiding
- Temporarily hiding content that will be shown again
- Want to clean up Effects when hidden
- Building tab interfaces with preserved state

Use conditional rendering when:
- Component won't be shown again
- Don't need to preserve state
- Want to completely remove from DOM

## Best Practices

- **State preservation**: Use when state preservation is important
- **Effect cleanup**: Effects are cleaned up automatically
- **Performance**: Hidden components render at lower priority
- **ViewTransition**: Works with ViewTransition for animations

<!--
Source references:
- https://react.dev/reference/react/Activity
-->

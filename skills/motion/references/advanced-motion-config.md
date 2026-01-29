---
name: advanced-motion-config
description: Global configuration and reduced motion
---

# MotionConfig

`MotionConfig` provides global configuration for Motion components. Use for setting defaults, enabling reduced motion, and configuring animation behavior.

## Usage

### Basic Configuration

```jsx
import { MotionConfig } from "motion/react"

function App() {
  return (
    <MotionConfig
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {/* All motion components inherit config */}
    </MotionConfig>
  )
}
```

### Reduced Motion

Respect user's reduced motion preference:

```jsx
<MotionConfig reducedMotion="user">
  {/* Respects prefers-reduced-motion */}
</MotionConfig>
```

Options:
- `"user"` - Respects system preference
- `"always"` - Always reduce motion
- `"never"` - Never reduce motion

### Custom Reduced Motion

```jsx
<MotionConfig
  reducedMotion="user"
  transition={{
    reducedMotion: {
      duration: 0.01  // Instant transitions when reduced
    }
  }}
>
  {/* ... */}
</MotionConfig>
```

### Static Mode

For non-interactive contexts (like Framer canvas):

```jsx
<MotionConfig isStatic>
  {/* Components render but don't animate */}
</MotionConfig>
```

## Key Points

- `MotionConfig` sets global defaults
- Wrap app or component tree
- `reducedMotion` respects accessibility
- `transition` sets default transitions
- `isStatic` for non-interactive contexts
- Config applies to all child components
- Override with component-level props

<!--
Source references:
- https://motion.dev/docs/react/motion-config
- https://github.com/motiondivision/motion/tree/main/packages/framer-motion/src/components/MotionConfig
-->

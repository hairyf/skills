---
name: layout-stack
description: Flutter Stack layout - Stack, Positioned, alignment, and overlapping widgets
---

# Stack Layout

`Stack` allows widgets to be positioned on top of each other, useful for overlapping content.

## Basic Stack

```dart
Stack(
  children: [
    Container(width: 200, height: 200, color: Colors.blue),
    Container(width: 100, height: 100, color: Colors.red),
  ],
)
```

## Stack Alignment

Control how non-positioned children are aligned.

```dart
Stack(
  alignment: Alignment.center, // How to align non-positioned children
  children: [
    Container(width: 200, height: 200, color: Colors.blue),
    Container(width: 100, height: 100, color: Colors.red), // Centered
  ],
)

// Common alignments
alignment: Alignment.topLeft
alignment: Alignment.topCenter
alignment: Alignment.topRight
alignment: Alignment.centerLeft
alignment: Alignment.center
alignment: Alignment.centerRight
alignment: Alignment.bottomLeft
alignment: Alignment.bottomCenter
alignment: Alignment.bottomRight
```

## Positioned Widget

Position children at specific locations.

```dart
Stack(
  children: [
    Container(width: 200, height: 200, color: Colors.blue),
    Positioned(
      top: 10,
      left: 10,
      child: Container(width: 50, height: 50, color: Colors.red),
    ),
    Positioned(
      bottom: 10,
      right: 10,
      child: Container(width: 50, height: 50, color: Colors.green),
    ),
  ],
)
```

## Positioned Properties

```dart
Positioned(
  // Specify all edges
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
  
  // Or use width/height with edges
  top: 10,
  left: 10,
  width: 100,
  height: 100,
  
  // Or use fill to fill entire stack
  fill: true,
  
  child: Container(color: Colors.red),
)
```

## Stack Fit

Control how non-positioned children are sized.

```dart
Stack(
  fit: StackFit.loose, // Children can be smaller than stack (default)
  children: [...],
)

Stack(
  fit: StackFit.expand, // Children fill stack size
  children: [
    Container(), // Fills entire stack
  ],
)

Stack(
  fit: StackFit.passthrough, // Use parent's constraints
  children: [...],
)
```

## Clip Behavior

Control clipping of children.

```dart
Stack(
  clipBehavior: Clip.none, // No clipping (default)
  children: [
    Positioned(
      top: -10, // Can extend outside stack
      child: Container(...),
    ),
  ],
)

Stack(
  clipBehavior: Clip.hardEdge, // Clip with hard edges
  children: [...],
)

Stack(
  clipBehavior: Clip.antiAlias, // Clip with anti-aliasing
  children: [...],
)
```

## Common Patterns

### Overlay Badge

```dart
Stack(
  children: [
    Container(
      width: 100,
      height: 100,
      color: Colors.blue,
    ),
    Positioned(
      top: 0,
      right: 0,
      child: Container(
        width: 20,
        height: 20,
        decoration: BoxDecoration(
          color: Colors.red,
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Text('3', style: TextStyle(color: Colors.white, fontSize: 12)),
        ),
      ),
    ),
  ],
)
```

### Centered Content with Background

```dart
Stack(
  alignment: Alignment.center,
  children: [
    Container(
      width: 200,
      height: 200,
      decoration: BoxDecoration(
        color: Colors.blue,
        shape: BoxShape.circle,
      ),
    ),
    Text('Centered', style: TextStyle(color: Colors.white)),
  ],
)
```

### Multiple Overlays

```dart
Stack(
  children: [
    // Background
    Container(width: 200, height: 200, color: Colors.grey),
    
    // Content
    Center(child: Text('Content')),
    
    // Top overlay
    Positioned(
      top: 10,
      left: 10,
      child: Icon(Icons.star, color: Colors.amber),
    ),
    
    // Bottom overlay
    Positioned(
      bottom: 10,
      right: 10,
      child: Icon(Icons.favorite, color: Colors.red),
    ),
  ],
)
```

## Key Points

- Use `Stack` to overlap widgets
- Use `alignment` to position non-positioned children
- Use `Positioned` to place children at specific locations
- Use `fit` to control how children fill the stack
- Use `clipBehavior` to control clipping
- Children are painted in order (first child is bottom layer)
- Positioned children ignore alignment
- Use Stack for badges, overlays, and layered content

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/basic.dart
- https://docs.flutter.dev/development/ui/layout
-->

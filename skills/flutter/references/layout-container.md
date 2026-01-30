---
name: layout-container
description: Flutter Container widget, BoxDecoration, padding, margin, and container styling
---

# Container Widget

`Container` combines common painting, positioning, and sizing widgets into a single widget.

## Basic Container

```dart
Container(
  width: 100,
  height: 100,
  color: Colors.blue,
  child: Text('Hello'),
)
```

## Container Properties

```dart
Container(
  // Sizing
  width: 200,
  height: 200,
  constraints: BoxConstraints(
    minWidth: 100,
    maxWidth: 300,
    minHeight: 100,
    maxHeight: 300,
  ),
  
  // Positioning
  alignment: Alignment.center,
  margin: EdgeInsets.all(16),
  padding: EdgeInsets.all(16),
  
  // Decoration
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8),
  ),
  
  // Foreground decoration
  foregroundDecoration: BoxDecoration(...),
  
  // Transform
  transform: Matrix4.rotationZ(0.1),
  
  // Child
  child: Text('Content'),
)
```

## BoxDecoration

Decorate container with colors, borders, shadows, etc.

```dart
BoxDecoration(
  // Color
  color: Colors.blue,
  
  // Border
  border: Border.all(
    color: Colors.black,
    width: 2,
  ),
  
  // Border radius
  borderRadius: BorderRadius.circular(8),
  // Or
  borderRadius: BorderRadius.only(
    topLeft: Radius.circular(8),
    topRight: Radius.circular(8),
  ),
  
  // Box shadow
  boxShadow: [
    BoxShadow(
      color: Colors.black.withOpacity(0.2),
      blurRadius: 4,
      offset: Offset(0, 2),
      spreadRadius: 1,
    ),
  ],
  
  // Gradient
  gradient: LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Colors.blue, Colors.purple],
  ),
  
  // Shape
  shape: BoxShape.rectangle, // rectangle, circle
)
```

## Padding

Add padding around child.

```dart
Container(
  padding: EdgeInsets.all(16), // All sides
  child: Text('Padded'),
)

// Specific sides
Container(
  padding: EdgeInsets.only(
    top: 10,
    left: 20,
    right: 20,
    bottom: 10,
  ),
  child: Text('Padded'),
)

// Symmetric padding
Container(
  padding: EdgeInsets.symmetric(
    horizontal: 20, // left and right
    vertical: 10, // top and bottom
  ),
  child: Text('Padded'),
)

// Or use Padding widget
Padding(
  padding: EdgeInsets.all(16),
  child: Text('Padded'),
)
```

## Margin

Add margin around container.

```dart
Container(
  margin: EdgeInsets.all(16),
  child: Container(color: Colors.blue),
)

// Specific sides
Container(
  margin: EdgeInsets.only(
    top: 10,
    left: 20,
  ),
  child: Container(color: Colors.blue),
)

// Or use Margin widget (if using a package)
```

## Alignment

Align child within container.

```dart
Container(
  width: 200,
  height: 200,
  alignment: Alignment.center,
  child: Text('Centered'),
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

// Custom alignment
alignment: Alignment(0.5, -0.5) // x, y from -1 to 1
```

## Transform

Apply transformations to container.

```dart
Container(
  transform: Matrix4.rotationZ(0.1), // Rotate
  child: Container(...),
)

Container(
  transform: Matrix4.translationValues(10, 10, 0), // Translate
  child: Container(...),
)

Container(
  transform: Matrix4.diagonal3Values(1.5, 1.5, 1.0), // Scale
  child: Container(...),
)
```

## Common Patterns

### Card-like Container

```dart
Container(
  margin: EdgeInsets.all(16),
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.1),
        blurRadius: 4,
        offset: Offset(0, 2),
      ),
    ],
  ),
  child: Text('Card content'),
)
```

### Rounded Container with Border

```dart
Container(
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(
      color: Colors.blue.shade700,
      width: 2,
    ),
  ),
  child: Text('Content', style: TextStyle(color: Colors.white)),
)
```

### Gradient Container

```dart
Container(
  width: 200,
  height: 200,
  decoration: BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        Colors.blue,
        Colors.purple,
        Colors.pink,
      ],
    ),
    borderRadius: BorderRadius.circular(8),
  ),
  child: Center(child: Text('Gradient')),
)
```

## Key Points

- `Container` combines sizing, positioning, and decoration
- Use `BoxDecoration` for visual styling
- Use `padding` for internal spacing
- Use `margin` for external spacing
- Use `alignment` to position child
- Use `transform` for transformations
- `color` property is shorthand for `BoxDecoration(color: ...)`
- When both `color` and `decoration` are set, `decoration` takes precedence
- Use `foregroundDecoration` for overlays

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/container.dart
- https://docs.flutter.dev/development/ui/widgets/layout
-->

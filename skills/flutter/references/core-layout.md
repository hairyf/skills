---
name: core-layout
description: Flutter layout system - constraints, Row, Column, Stack, Flex, and sizing widgets
---

# Layout System

Flutter's layout system uses a constraint-based approach where parent widgets provide constraints to their children, and children determine their size within those constraints.

## Layout Constraints

Flutter uses `BoxConstraints` to define the size constraints for widgets:

- **minWidth, maxWidth** - Horizontal constraints
- **minHeight, maxHeight** - Vertical constraints
- **isTight** - Constraints are exactly specified (min == max)
- **isLoose** - Constraints allow flexibility (min < max)

```dart
// Tight constraints - widget must be exactly 100x100
Container(
  width: 100,
  height: 100,
  child: child,
)

// Loose constraints - widget can be any size up to 200x200
ConstrainedBox(
  constraints: const BoxConstraints(
    maxWidth: 200,
    maxHeight: 200,
  ),
  child: child,
)
```

## Flex Layouts (Row & Column)

`Row` and `Column` arrange children in a single direction. They use the Flex layout algorithm.

### Row

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.start, // start, end, center, spaceBetween, spaceAround, spaceEvenly
  crossAxisAlignment: CrossAxisAlignment.center, // start, end, center, stretch, baseline
  mainAxisSize: MainAxisSize.max, // max, min
  textDirection: TextDirection.ltr,
  verticalDirection: VerticalDirection.down,
  children: [
    Container(width: 50, height: 50, color: Colors.red),
    Container(width: 50, height: 50, color: Colors.green),
    Container(width: 50, height: 50, color: Colors.blue),
  ],
)
```

### Column

```dart
Column(
  mainAxisAlignment: MainAxisAlignment.start,
  crossAxisAlignment: CrossAxisAlignment.center,
  mainAxisSize: MainAxisSize.max,
  children: [
    Container(width: 50, height: 50, color: Colors.red),
    Container(width: 50, height: 50, color: Colors.green),
    Container(width: 50, height: 50, color: Colors.blue),
  ],
)
```

### Flexible & Expanded

Use `Flexible` and `Expanded` to control how children fill available space in Row/Column.

```dart
Row(
  children: [
    Expanded(
      flex: 2, // Takes 2/3 of available space
      child: Container(color: Colors.red),
    ),
    Expanded(
      flex: 1, // Takes 1/3 of available space
      child: Container(color: Colors.green),
    ),
  ],
)

Row(
  children: [
    Flexible(
      flex: 1,
      fit: FlexFit.loose, // Can be smaller than available space
      child: Container(color: Colors.red),
    ),
    Expanded(
      flex: 1,
      child: Container(color: Colors.green), // Must fill available space
    ),
  ],
)
```

## Stack Layout

`Stack` allows widgets to be positioned on top of each other.

```dart
Stack(
  alignment: Alignment.center, // How to align non-positioned children
  fit: StackFit.loose, // loose, expand, passthrough
  clipBehavior: Clip.hardEdge, // none, hardEdge, antiAlias, antiAliasWithSaveLayer
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

## Container

`Container` combines common painting, positioning, and sizing widgets.

```dart
Container(
  width: 100,
  height: 100,
  padding: const EdgeInsets.all(16),
  margin: const EdgeInsets.all(8),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8),
    border: Border.all(color: Colors.black, width: 2),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.2),
        blurRadius: 4,
        offset: const Offset(0, 2),
      ),
    ],
  ),
  child: const Text('Hello'),
)
```

## Sizing Widgets

### SizedBox

Fixed size box.

```dart
SizedBox(
  width: 100,
  height: 100,
  child: child,
)
```

### ConstrainedBox

Apply constraints to a child.

```dart
ConstrainedBox(
  constraints: const BoxConstraints(
    minWidth: 100,
    maxWidth: 200,
    minHeight: 50,
    maxHeight: 100,
  ),
  child: child,
)
```

### UnconstrainedBox

Remove constraints from parent (use with caution).

```dart
UnconstrainedBox(
  constrainedAxis: Axis.horizontal,
  child: child,
)
```

### AspectRatio

Enforce a specific aspect ratio.

```dart
AspectRatio(
  aspectRatio: 16 / 9,
  child: Container(color: Colors.blue),
)
```

### FittedBox

Scale and position a child to fit within available space.

```dart
FittedBox(
  fit: BoxFit.contain, // contain, cover, fill, fitWidth, fitHeight, none, scaleDown
  alignment: Alignment.center,
  child: child,
)
```

## LayoutBuilder

Use `LayoutBuilder` to build widgets based on available constraints.

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 600) {
      return WideLayout();
    } else {
      return NarrowLayout();
    }
  },
)
```

## Key Points

- Flutter uses a constraint-based layout system
- Parent widgets provide constraints, children determine their size
- Row and Column use the Flex layout algorithm
- Stack allows overlapping widgets
- Use Expanded/Flexible to control space distribution in Row/Column
- Container combines multiple layout and styling widgets
- Use LayoutBuilder to build responsive layouts based on constraints

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/basic.dart
- https://docs.flutter.dev/development/ui/layout
-->

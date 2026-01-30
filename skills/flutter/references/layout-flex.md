---
name: layout-flex
description: Flutter flex layouts - Row, Column, Flex, Flexible, Expanded, and flex properties
---

# Flex Layouts

Flutter's flex layout system arranges children in a single direction using the Flex algorithm.

## Row

Arrange children horizontally.

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.start, // start, end, center, spaceBetween, spaceAround, spaceEvenly
  crossAxisAlignment: CrossAxisAlignment.center, // start, end, center, stretch, baseline
  mainAxisSize: MainAxisSize.max, // max, min
  textDirection: TextDirection.ltr, // ltr, rtl
  verticalDirection: VerticalDirection.down, // down, up
  children: [
    Container(width: 50, height: 50, color: Colors.red),
    Container(width: 50, height: 50, color: Colors.green),
    Container(width: 50, height: 50, color: Colors.blue),
  ],
)
```

## Column

Arrange children vertically.

```dart
Column(
  mainAxisAlignment: MainAxisAlignment.start,
  crossAxisAlignment: CrossAxisAlignment.center,
  mainAxisSize: MainAxisSize.max,
  textDirection: TextDirection.ltr,
  verticalDirection: VerticalDirection.down,
  children: [
    Container(width: 50, height: 50, color: Colors.red),
    Container(width: 50, height: 50, color: Colors.green),
    Container(width: 50, height: 50, color: Colors.blue),
  ],
)
```

## MainAxisAlignment

Control alignment along the main axis.

```dart
// start - align to start
Row(
  mainAxisAlignment: MainAxisAlignment.start,
  children: [...],
)

// end - align to end
Row(
  mainAxisAlignment: MainAxisAlignment.end,
  children: [...],
)

// center - center children
Row(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [...],
)

// spaceBetween - space evenly between children
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [...],
)

// spaceAround - space evenly around children
Row(
  mainAxisAlignment: MainAxisAlignment.spaceAround,
  children: [...],
)

// spaceEvenly - space evenly including edges
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: [...],
)
```

## CrossAxisAlignment

Control alignment along the cross axis.

```dart
// start - align to start
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [...],
)

// end - align to end
Column(
  crossAxisAlignment: CrossAxisAlignment.end,
  children: [...],
)

// center - center children
Column(
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [...],
)

// stretch - stretch to fill cross axis
Column(
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [...],
)

// baseline - align to baseline
Row(
  crossAxisAlignment: CrossAxisAlignment.baseline,
  textBaseline: TextBaseline.alphabetic,
  children: [...],
)
```

## Flexible

Allow child to take flexible space.

```dart
Row(
  children: [
    Flexible(
      flex: 1,
      fit: FlexFit.loose, // Can be smaller than available space
      child: Container(color: Colors.red),
    ),
    Flexible(
      flex: 2,
      fit: FlexFit.tight, // Must fill available space (same as Expanded)
      child: Container(color: Colors.green),
    ),
  ],
)
```

## Expanded

Force child to fill available space (Flexible with FlexFit.tight).

```dart
Row(
  children: [
    Expanded(
      flex: 1, // Takes 1/3 of available space
      child: Container(color: Colors.red),
    ),
    Expanded(
      flex: 2, // Takes 2/3 of available space
      child: Container(color: Colors.green),
    ),
  ],
)
```

## Spacer

Empty space that expands.

```dart
Row(
  children: [
    Text('Start'),
    Spacer(), // Takes all available space
    Text('End'),
  ],
)

Row(
  children: [
    Text('Start'),
    Spacer(flex: 2), // Takes 2x space compared to other Spacers
    Text('Middle'),
    Spacer(flex: 1), // Takes 1x space
    Text('End'),
  ],
)
```

## Flex Widget

Generic flex widget (base for Row and Column).

```dart
Flex(
  direction: Axis.horizontal, // horizontal, vertical
  mainAxisAlignment: MainAxisAlignment.start,
  crossAxisAlignment: CrossAxisAlignment.center,
  mainAxisSize: MainAxisSize.max,
  textDirection: TextDirection.ltr,
  verticalDirection: VerticalDirection.down,
  textBaseline: TextBaseline.alphabetic,
  clipBehavior: Clip.none,
  children: [
    Flexible(child: Container()),
    Expanded(child: Container()),
  ],
)
```

## Nested Flex Layouts

Combine Row and Column for complex layouts.

```dart
Column(
  children: [
    Row(
      children: [
        Expanded(child: Container(color: Colors.red)),
        Expanded(child: Container(color: Colors.green)),
      ],
    ),
    Row(
      children: [
        Expanded(flex: 2, child: Container(color: Colors.blue)),
        Expanded(flex: 1, child: Container(color: Colors.yellow)),
      ],
    ),
  ],
)
```

## Key Points

- Use `Row` for horizontal layouts
- Use `Column` for vertical layouts
- Use `MainAxisAlignment` to control main axis alignment
- Use `CrossAxisAlignment` to control cross axis alignment
- Use `Expanded` to make children fill available space
- Use `Flexible` for flexible sizing with more control
- Use `Spacer` to add flexible empty space
- Use `flex` property to control space distribution
- Set `mainAxisSize: MainAxisSize.min` to take minimum space

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/basic.dart
- https://docs.flutter.dev/development/ui/layout
-->

---
name: widgets-buttons
description: Flutter button widgets - ElevatedButton, TextButton, OutlinedButton, IconButton, and button styling
---

# Button Widgets

Flutter provides several button widgets following Material Design guidelines.

## ElevatedButton

Raised button with elevation.

```dart
ElevatedButton(
  onPressed: () {
    // Handle press
  },
  onLongPress: () {
    // Handle long press
  },
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.blue,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  child: const Text('Elevated Button'),
)
```

## TextButton

Flat button with text.

```dart
TextButton(
  onPressed: () {
    // Handle press
  },
  style: TextButton.styleFrom(
    foregroundColor: Colors.blue,
    padding: const EdgeInsets.all(16),
  ),
  child: const Text('Text Button'),
)
```

## OutlinedButton

Button with outline border.

```dart
OutlinedButton(
  onPressed: () {
    // Handle press
  },
  style: OutlinedButton.styleFrom(
    foregroundColor: Colors.blue,
    side: const BorderSide(color: Colors.blue, width: 2),
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
  ),
  child: const Text('Outlined Button'),
)
```

## IconButton

Button with an icon.

```dart
IconButton(
  onPressed: () {
    // Handle press
  },
  icon: const Icon(Icons.favorite),
  color: Colors.red,
  iconSize: 24,
  tooltip: 'Like',
)
```

## FilledButton

Filled button (Material 3).

```dart
FilledButton(
  onPressed: () {
    // Handle press
  },
  style: FilledButton.styleFrom(
    backgroundColor: Colors.blue,
    foregroundColor: Colors.white,
  ),
  child: const Text('Filled Button'),
)
```

## ButtonBar

Group buttons horizontally.

```dart
ButtonBar(
  alignment: MainAxisAlignment.center,
  children: [
    TextButton(onPressed: () {}, child: const Text('Cancel')),
    ElevatedButton(onPressed: () {}, child: const Text('OK')),
  ],
)
```

## FloatingActionButton

Circular button that floats above content.

```dart
FloatingActionButton(
  onPressed: () {
    // Handle press
  },
  backgroundColor: Colors.blue,
  foregroundColor: Colors.white,
  child: const Icon(Icons.add),
)

// Extended FAB
FloatingActionButton.extended(
  onPressed: () {},
  icon: const Icon(Icons.add),
  label: const Text('Add'),
)
```

## Key Points

- Use `ElevatedButton` for primary actions
- Use `TextButton` for secondary actions
- Use `OutlinedButton` for outlined style
- Use `IconButton` for icon-only actions
- Use `FilledButton` for Material 3 filled style
- Use `FloatingActionButton` for prominent floating actions
- Customize buttons with `styleFrom()` method
- Set `onPressed: null` to disable button

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/material/button.dart
- https://docs.flutter.dev/development/ui/widgets/material#Buttons
-->

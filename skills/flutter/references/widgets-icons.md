---
name: widgets-icons
description: Flutter Icon widget, IconData, IconTheme, and icon usage
---

# Icon Widgets

Flutter provides widgets for displaying icons from icon fonts.

## Icon Widget

Display icons from icon fonts.

```dart
Icon(
  Icons.star,
  size: 24,
  color: Colors.amber,
  semanticLabel: 'Star icon',
)
```

## Icon Properties

```dart
Icon(
  Icons.favorite,
  size: 48, // Icon size in logical pixels
  color: Colors.red, // Icon color
  fill: 0.0, // Fill weight (0.0 to 1.0) for filled icons
  weight: 400, // Font weight (100-900)
  grade: 0, // Grade adjustment (-25 to 200)
  opticalSize: 24, // Optical size adjustment
  semanticLabel: 'Favorite icon', // Accessibility label
  textDirection: TextDirection.ltr, // Text direction
)
```

## Material Icons

Use predefined Material icons.

```dart
// Common icons
Icon(Icons.home)
Icon(Icons.search)
Icon(Icons.favorite)
Icon(Icons.settings)
Icon(Icons.person)
Icon(Icons.add)
Icon(Icons.delete)
Icon(Icons.edit)
Icon(Icons.close)
Icon(Icons.check)
Icon(Icons.arrow_back)
Icon(Icons.arrow_forward)
Icon(Icons.menu)
Icon(Icons.more_vert)
```

## Custom Icons

Use custom icon fonts.

```dart
// Define custom icon data
class CustomIcons {
  static const IconData customIcon = IconData(
    0xe900, // Unicode code point
    fontFamily: 'CustomIcons',
    fontPackage: null,
  );
}

// Use custom icon
Icon(CustomIcons.customIcon)
```

## IconTheme

Provide icon theme to descendant widgets.

```dart
IconTheme(
  data: IconThemeData(
    color: Colors.blue,
    size: 24,
    opacity: 1.0,
  ),
  child: Row(
    children: [
      Icon(Icons.star), // Uses theme color
      Icon(Icons.favorite), // Uses theme color
    ],
  ),
)

// Access theme
final iconTheme = IconTheme.of(context);
final iconColor = iconTheme.color;
final iconSize = iconTheme.size;
```

## IconButton

Interactive icon button.

```dart
IconButton(
  icon: Icon(Icons.favorite),
  onPressed: () {
    // Handle press
  },
  iconSize: 24,
  color: Colors.red,
  tooltip: 'Add to favorites',
  splashRadius: 24, // Splash radius
)
```

## ImageIcon

Use images as icons.

```dart
ImageIcon(
  AssetImage('assets/icons/custom_icon.png'),
  size: 48,
  color: Colors.blue,
)

ImageIcon(
  NetworkImage('https://example.com/icon.png'),
  size: 48,
)
```

## Icon Usage Patterns

```dart
// In AppBar
AppBar(
  leading: IconButton(
    icon: Icon(Icons.menu),
    onPressed: () {},
  ),
  actions: [
    IconButton(
      icon: Icon(Icons.search),
      onPressed: () {},
    ),
  ],
)

// In ListTile
ListTile(
  leading: Icon(Icons.person),
  title: Text('Profile'),
  trailing: Icon(Icons.arrow_forward),
)

// In buttons
ElevatedButton.icon(
  icon: Icon(Icons.add),
  label: Text('Add'),
  onPressed: () {},
)
```

## Key Points

- Use `Icon` widget to display icons
- Use `Icons` class for Material Design icons
- Customize icon appearance with `size` and `color`
- Use `IconTheme` to provide icon theme to descendants
- Use `IconButton` for interactive icons
- Use `ImageIcon` for custom image-based icons
- Provide `semanticLabel` for accessibility
- Use `fill` property for filled icon variants (Material 3)

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/icon.dart
- https://docs.flutter.dev/development/ui/widgets/icons
-->

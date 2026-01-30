---
name: features-material-3
description: Material 3 design system - Material 3 components, color schemes, and design tokens
---

# Material 3

Material 3 (Material You) is the latest Material Design system with dynamic color and updated components.

## Enable Material 3

Enable Material 3 in your app.

```dart
MaterialApp(
  theme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
  ),
  home: const HomeScreen(),
)
```

## ColorScheme

Material 3 uses dynamic color schemes.

```dart
// Generate from seed color
ColorScheme.fromSeed(
  seedColor: Colors.blue,
  brightness: Brightness.light,
)

// Custom color scheme
ColorScheme(
  brightness: Brightness.light,
  primary: Colors.blue,
  onPrimary: Colors.white,
  secondary: Colors.purple,
  onSecondary: Colors.white,
  error: Colors.red,
  onError: Colors.white,
  surface: Colors.white,
  onSurface: Colors.black,
  surfaceVariant: Colors.grey[100]!,
  onSurfaceVariant: Colors.grey[800]!,
)
```

## Material 3 Components

### FilledButton

Filled button style (Material 3).

```dart
FilledButton(
  onPressed: () {},
  child: const Text('Filled Button'),
)

FilledButton.icon(
  onPressed: () {},
  icon: const Icon(Icons.add),
  label: const Text('Add'),
)
```

### FilledTonalButton

Tonal filled button.

```dart
FilledTonalButton(
  onPressed: () {},
  child: const Text('Tonal Button'),
)
```

### SegmentedButton

Segmented button group.

```dart
SegmentedButton<String>(
  segments: const [
    ButtonSegment(value: 'list', label: Text('List')),
    ButtonSegment(value: 'grid', label: Text('Grid')),
  ],
  selected: {'list'},
  onSelectionChanged: (Set<String> newSelection) {
    setState(() {
      selected = newSelection;
    });
  },
)
```

### NavigationBar

Bottom navigation bar (Material 3).

```dart
NavigationBar(
  selectedIndex: _currentIndex,
  onTap: (index) {
    setState(() {
      _currentIndex = index;
    });
  },
  destinations: const [
    NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
    NavigationDestination(icon: Icon(Icons.search), label: 'Search'),
    NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
  ],
)
```

### NavigationRail

Side navigation rail.

```dart
NavigationRail(
  selectedIndex: _currentIndex,
  onDestinationSelected: (index) {
    setState(() {
      _currentIndex = index;
    });
  },
  labelType: NavigationRailLabelType.all,
  destinations: const [
    NavigationRailDestination(
      icon: Icon(Icons.home),
      label: Text('Home'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.search),
      label: Text('Search'),
    ),
  ],
)
```

### SearchBar

Search bar component.

```dart
SearchBar(
  hintText: 'Search...',
  onChanged: (value) {
    // Handle search
  },
  leading: const Icon(Icons.search),
  trailing: [
    IconButton(
      icon: const Icon(Icons.clear),
      onPressed: () {},
    ),
  ],
)
```

## Material 3 Theming

```dart
ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.blue,
    brightness: Brightness.light,
  ),
  // Material 3 specific themes
  navigationBarTheme: NavigationBarThemeData(...),
  navigationRailTheme: NavigationRailThemeData(...),
  searchBarTheme: SearchBarThemeData(...),
)
```

## Key Points

- Set `useMaterial3: true` to enable Material 3
- Use `ColorScheme.fromSeed()` for dynamic colors
- Material 3 introduces new components like `FilledButton`, `NavigationBar`, `SearchBar`
- Material 3 uses updated design tokens and spacing
- Components adapt to color scheme automatically
- Material 3 provides better accessibility and customization

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/material
- https://m3.material.io/
-->

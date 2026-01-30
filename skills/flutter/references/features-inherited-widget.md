---
name: features-inherited-widget
description: Flutter InheritedWidget - sharing data down the widget tree, theme access, and InheritedWidget patterns
---

# InheritedWidget

`InheritedWidget` efficiently shares data down the widget tree.

## Basic InheritedWidget

```dart
class CounterInherited extends InheritedWidget {
  final int count;
  final VoidCallback increment;

  const CounterInherited({
    super.key,
    required this.count,
    required this.increment,
    required super.child,
  });

  static CounterInherited? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<CounterInherited>();
  }

  @override
  bool updateShouldNotify(CounterInherited oldWidget) {
    return count != oldWidget.count;
  }
}
```

## Using InheritedWidget

```dart
CounterInherited(
  count: _count,
  increment: _increment,
  child: MyApp(),
)

// Access in descendant
class CounterDisplay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final counter = CounterInherited.of(context);
    return Text('Count: ${counter?.count ?? 0}');
  }
}
```

## updateShouldNotify

Control when descendants rebuild.

```dart
@override
bool updateShouldNotify(CounterInherited oldWidget) {
  // Only rebuild if count changed
  return count != oldWidget.count;
}
```

## dependOnInheritedWidgetOfExactType

Register dependency and rebuild when widget changes.

```dart
static CounterInherited? of(BuildContext context) {
  return context.dependOnInheritedWidgetOfExactType<CounterInherited>();
}
```

## getElementForInheritedWidgetOfExactType

Access without registering dependency.

```dart
static CounterInherited? of(BuildContext context) {
  final element = context.getElementForInheritedWidgetOfExactType<CounterInherited>();
  return element?.widget as CounterInherited?;
}
```

## Complete Example

```dart
class ThemeInherited extends InheritedWidget {
  final ThemeData theme;
  final VoidCallback toggleTheme;

  const ThemeInherited({
    super.key,
    required this.theme,
    required this.toggleTheme,
    required super.child,
  });

  static ThemeInherited? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<ThemeInherited>();
  }

  @override
  bool updateShouldNotify(ThemeInherited oldWidget) {
    return theme != oldWidget.theme;
  }
}

// Usage
ThemeInherited(
  theme: _theme,
  toggleTheme: _toggleTheme,
  child: MaterialApp(...),
)

// Access
final theme = ThemeInherited.of(context)?.theme;
```

## Key Points

- Use `InheritedWidget` to share data down the tree
- Implement `updateShouldNotify()` to control rebuilds
- Use `dependOnInheritedWidgetOfExactType()` to register dependency
- Use `getElementForInheritedWidgetOfExactType()` to access without dependency
- More efficient than passing data through constructors
- Used by Theme, MediaQuery, Localizations
- Only rebuilds descendants when data changes

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/framework.dart
- https://docs.flutter.dev/development/data-and-backend/state-mgmt/simple#inheritedwidget
-->

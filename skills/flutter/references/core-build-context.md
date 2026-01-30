---
name: core-build-context
description: BuildContext usage, InheritedWidget, accessing theme and other inherited values
---

# BuildContext

`BuildContext` represents a location in the widget tree. It provides access to inherited widgets, theme data, and other context-dependent information.

## Understanding BuildContext

`BuildContext` is passed to the `build()` method and represents the widget's position in the tree.

```dart
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    // context is the BuildContext for this widget
    return Container();
  }
}
```

## Accessing InheritedWidgets

Use `BuildContext` to access `InheritedWidget` values like theme, media query, and localization.

### Theme

```dart
class ThemedWidget extends StatelessWidget {
  const ThemedWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Container(
      color: colorScheme.primary,
      child: Text(
        'Hello',
        style: theme.textTheme.headlineMedium,
      ),
    );
  }
}
```

### MediaQuery

```dart
class ResponsiveWidget extends StatelessWidget {
  const ResponsiveWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final screenWidth = mediaQuery.size.width;
    final screenHeight = mediaQuery.size.height;
    final padding = mediaQuery.padding;
    
    return Container(
      width: screenWidth * 0.8,
      height: screenHeight * 0.5,
      padding: EdgeInsets.only(top: padding.top),
      child: child,
    );
  }
}
```

### Localization

```dart
class LocalizedWidget extends StatelessWidget {
  const LocalizedWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final localizations = Localizations.of(context);
    final locale = Localizations.localeOf(context);
    
    return Text('Current locale: ${locale.languageCode}');
  }
}
```

## Custom InheritedWidget

Create custom `InheritedWidget` to provide values to descendant widgets.

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

// Usage
class CounterDisplay extends StatelessWidget {
  const CounterDisplay({super.key});

  @override
  Widget build(BuildContext context) {
    final counter = CounterInherited.of(context);
    if (counter == null) {
      return const Text('Counter not found');
    }
    
    return Column(
      children: [
        Text('Count: ${counter.count}'),
        ElevatedButton(
          onPressed: counter.increment,
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

## Context Methods

### Navigator

```dart
// Navigate to a new route
Navigator.of(context).push(
  MaterialPageRoute(builder: (context) => NextPage()),
);

// Pop current route
Navigator.of(context).pop();

// Check if can pop
if (Navigator.of(context).canPop()) {
  Navigator.of(context).pop();
}
```

### Scaffold

```dart
// Show snackbar
ScaffoldMessenger.of(context).showSnackBar(
  const SnackBar(content: Text('Hello')),
);

// Show bottom sheet
showModalBottomSheet(
  context: context,
  builder: (context) => Container(),
);

// Show dialog
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: const Text('Title'),
    content: const Text('Content'),
  ),
);
```

### Focus

```dart
// Unfocus current focus node
FocusScope.of(context).unfocus();

// Request focus
FocusScope.of(context).requestFocus(focusNode);
```

## Context Caveats

### Don't Store BuildContext

```dart
// ❌ Bad - context may become invalid
class BadWidget extends StatefulWidget {
  @override
  State<BadWidget> createState() => _BadWidgetState();
}

class _BadWidgetState extends State<BadWidget> {
  BuildContext? _context;

  @override
  void initState() {
    super.initState();
    _context = context; // Don't do this!
  }
}

// ✅ Good - use context when needed
class GoodWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        // Use context here, not stored
        Navigator.of(context).pop();
      },
      child: const Text('Pop'),
    );
  }
}
```

### Async Operations

When using context after async operations, check if the widget is still mounted.

```dart
Future<void> _loadData() async {
  final data = await fetchData();
  
  if (!mounted) return; // Check if widget is still in tree
  
  setState(() {
    _data = data;
  });
  
  // Safe to use context after mounted check
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Data loaded')),
  );
}
```

## Key Points

- `BuildContext` represents a widget's location in the tree
- Use `context` to access `InheritedWidget` values (Theme, MediaQuery, etc.)
- Use `of(context)` pattern to access inherited widgets
- Don't store `BuildContext` - it may become invalid
- Check `mounted` before using context after async operations
- `BuildContext` is only valid during the `build()` method and callbacks

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/framework.dart
- https://docs.flutter.dev/development/ui/interactive
-->

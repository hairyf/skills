---
name: features-lifecycle
description: Flutter widget lifecycle - initState, dispose, didChangeDependencies, and lifecycle management
---

# Widget Lifecycle

Understanding widget lifecycle helps manage resources and state properly.

## StatefulWidget Lifecycle

```dart
class MyWidget extends StatefulWidget {
  const MyWidget({super.key});

  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  @override
  void initState() {
    super.initState();
    // Called once when widget is created
    // Initialize state, subscribe to streams, etc.
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Called when InheritedWidgets change
    // Called after initState
  }

  @override
  Widget build(BuildContext context) {
    // Called every time widget needs to rebuild
    return Container();
  }

  @override
  void didUpdateWidget(MyWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Called when widget configuration changes
    // Compare oldWidget with widget
  }

  @override
  void deactivate() {
    // Called when widget is removed from tree
    // Widget may be reinserted elsewhere
    super.deactivate();
  }

  @override
  void dispose() {
    // Called when widget is permanently removed
    // Clean up resources, cancel subscriptions
    super.dispose();
  }
}
```

## initState

Initialize state and resources.

```dart
@override
void initState() {
  super.initState();
  
  // Initialize state
  _counter = 0;
  
  // Subscribe to streams
  _subscription = stream.listen((data) {
    setState(() {
      _data = data;
    });
  });
  
  // Start animations
  _controller.forward();
}
```

## dispose

Clean up resources.

```dart
@override
void dispose() {
  // Cancel subscriptions
  _subscription?.cancel();
  
  // Dispose controllers
  _controller.dispose();
  _focusNode.dispose();
  
  // Close streams
  _streamController.close();
  
  super.dispose();
}
```

## didChangeDependencies

React to InheritedWidget changes.

```dart
@override
void didChangeDependencies() {
  super.didChangeDependencies();
  
  // Access InheritedWidget
  final theme = Theme.of(context);
  final locale = Localizations.localeOf(context);
  
  // React to changes
  if (theme != _previousTheme) {
    // Theme changed
  }
}
```

## didUpdateWidget

Handle widget configuration changes.

```dart
@override
void didUpdateWidget(MyWidget oldWidget) {
  super.didUpdateWidget(oldWidget);
  
  // Compare old and new configuration
  if (widget.data != oldWidget.data) {
    // Data changed, update state
    _loadData();
  }
}
```

## App Lifecycle

Listen to app lifecycle changes.

```dart
class AppLifecycleWidget extends StatefulWidget {
  const AppLifecycleWidget({super.key});

  @override
  State<AppLifecycleWidget> createState() => _AppLifecycleWidgetState();
}

class _AppLifecycleWidgetState extends State<AppLifecycleWidget>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
        // App resumed
        break;
      case AppLifecycleState.paused:
        // App paused
        break;
      case AppLifecycleState.inactive:
        // App inactive
        break;
      case AppLifecycleState.detached:
        // App detached
        break;
      case AppLifecycleState.hidden:
        // App hidden
        break;
    }
  }
}
```

## Key Points

- `initState()` - Called once, initialize state
- `didChangeDependencies()` - Called when InheritedWidgets change
- `build()` - Called every rebuild
- `didUpdateWidget()` - Called when configuration changes
- `deactivate()` - Called when removed from tree
- `dispose()` - Called when permanently removed
- Always call `super` methods
- Clean up resources in `dispose()`
- Use `WidgetsBindingObserver` for app lifecycle

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/framework.dart
- https://docs.flutter.dev/development/ui/widgets-intro#stateful-and-stateless-widgets
-->

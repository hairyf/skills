---
name: features-navigation
description: Flutter navigation - Navigator.push, Navigator.pop, routes, and navigation patterns
---

# Navigation

Flutter provides the `Navigator` widget for managing a stack of routes. Navigation allows users to move between different screens in your app.

## Basic Navigation

### Push a Route

```dart
// Navigate to a new screen
Navigator.of(context).push(
  MaterialPageRoute(
    builder: (context) => const NextScreen(),
  ),
);

// With result
final result = await Navigator.of(context).push(
  MaterialPageRoute(
    builder: (context) => const NextScreen(),
  ),
);
```

### Pop a Route

```dart
// Pop current route
Navigator.of(context).pop();

// Pop with result
Navigator.of(context).pop('result data');
```

### Complete Example

```dart
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            final result = await Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => const DetailScreen(),
              ),
            );
            
            if (result != null) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Result: $result')),
              );
            }
          },
          child: const Text('Go to Detail'),
        ),
      ),
    );
  }
}

class DetailScreen extends StatelessWidget {
  const DetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detail')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.of(context).pop('Data from detail');
          },
          child: const Text('Go Back'),
        ),
      ),
    );
  }
}
```

## Navigation Methods

### pushReplacement

Replace the current route with a new one.

```dart
Navigator.of(context).pushReplacement(
  MaterialPageRoute(builder: (context) => const NewScreen()),
);
```

### pushAndRemoveUntil

Push a new route and remove all previous routes until a condition is met.

```dart
// Navigate to home and remove all previous routes
Navigator.of(context).pushAndRemoveUntil(
  MaterialPageRoute(builder: (context) => const HomeScreen()),
  (route) => false, // Remove all routes
);

// Navigate to login and remove all routes except the first one
Navigator.of(context).pushAndRemoveUntil(
  MaterialPageRoute(builder: (context) => const LoginScreen()),
  (route) => route.isFirst, // Keep only the first route
);
```

### popUntil

Pop routes until a condition is met.

```dart
// Pop until reaching home screen
Navigator.of(context).popUntil((route) => route.settings.name == '/home');
```

## Route Types

### MaterialPageRoute

Standard Material Design page transition.

```dart
Navigator.of(context).push(
  MaterialPageRoute(
    builder: (context) => const NextScreen(),
    settings: const RouteSettings(
      name: '/detail',
      arguments: {'id': 123},
    ),
  ),
);
```

### CupertinoPageRoute

iOS-style page transition.

```dart
Navigator.of(context).push(
  CupertinoPageRoute(
    builder: (context) => const NextScreen(),
  ),
);
```

### PageRouteBuilder

Custom page transition.

```dart
Navigator.of(context).push(
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => const NextScreen(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: animation,
        child: child,
      );
    },
    transitionDuration: const Duration(milliseconds: 300),
  ),
);
```

## Accessing Route Arguments

```dart
class DetailScreen extends StatelessWidget {
  const DetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    final id = args?['id'] ?? 0;
    
    return Scaffold(
      appBar: AppBar(title: Text('Detail $id')),
      body: Center(
        child: Text('ID: $id'),
      ),
    );
  }
}
```

## Navigation State

### Check if Can Pop

```dart
if (Navigator.of(context).canPop()) {
  Navigator.of(context).pop();
} else {
  // Handle case where there's nothing to pop
}
```

### Get Current Route

```dart
final route = ModalRoute.of(context);
final routeName = route?.settings.name;
final arguments = route?.settings.arguments;
```

## Key Points

- Use `Navigator.push()` to navigate forward
- Use `Navigator.pop()` to go back
- Pass data back using `pop(result)`
- Use `pushReplacement()` to replace current route
- Use `pushAndRemoveUntil()` for login/logout flows
- Access route arguments via `ModalRoute.of(context)?.settings.arguments`
- Check `canPop()` before popping to avoid errors

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/navigator.dart
- https://docs.flutter.dev/development/ui/navigation
-->

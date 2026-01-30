---
name: features-named-routes
description: Flutter named routes - route configuration, onGenerateRoute, and route arguments
---

# Named Routes

Named routes provide a cleaner way to navigate using route names instead of route builders.

## Basic Setup

Define routes in MaterialApp.

```dart
MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (context) => const HomeScreen(),
    '/detail': (context) => const DetailScreen(),
    '/settings': (context) => const SettingsScreen(),
  },
)
```

## Navigation with Named Routes

```dart
// Navigate to named route
Navigator.pushNamed(context, '/detail');

// Navigate with arguments
Navigator.pushNamed(
  context,
  '/detail',
  arguments: {'id': 123, 'name': 'Item'},
);

// Navigate and remove current route
Navigator.pushReplacementNamed(context, '/home');

// Navigate and remove all previous routes
Navigator.pushNamedAndRemoveUntil(
  context,
  '/login',
  (route) => false, // Remove all routes
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
    final name = args?['name'] ?? '';

    return Scaffold(
      appBar: AppBar(title: Text('Detail: $name')),
      body: Center(
        child: Text('ID: $id'),
      ),
    );
  }
}
```

## onGenerateRoute

Generate routes dynamically with custom logic.

```dart
MaterialApp(
  initialRoute: '/',
  onGenerateRoute: (settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      
      case '/detail':
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => DetailScreen(
            id: args?['id'] ?? 0,
            name: args?['name'] ?? '',
          ),
        );
      
      case '/user':
        final userId = settings.arguments as String;
        return MaterialPageRoute(
          builder: (_) => UserScreen(userId: userId),
        );
      
      default:
        return MaterialPageRoute(
          builder: (_) => const NotFoundScreen(),
        );
    }
  },
)
```

## Route Settings

Pass route settings for better route management.

```dart
Navigator.pushNamed(
  context,
  '/detail',
  arguments: {'id': 123},
);

// Access settings
final route = ModalRoute.of(context);
final routeName = route?.settings.name;
final arguments = route?.settings.arguments;
```

## Route Generation with Type Safety

Use typed route arguments for better type safety.

```dart
class RouteArguments {
  final int id;
  final String name;

  RouteArguments({required this.id, required this.name});
}

// Navigation
Navigator.pushNamed(
  context,
  '/detail',
  arguments: RouteArguments(id: 123, name: 'Item'),
);

// Access
final args = ModalRoute.of(context)?.settings.arguments as RouteArguments?;
```

## Unknown Route Handling

Handle unknown routes.

```dart
MaterialApp(
  onGenerateRoute: (settings) {
    // Handle known routes
    if (settings.name == '/') {
      return MaterialPageRoute(builder: (_) => const HomeScreen());
    }
    
    // Handle unknown routes
    return MaterialPageRoute(
      builder: (_) => Scaffold(
        appBar: AppBar(title: const Text('Not Found')),
        body: Center(
          child: Text('Route "${settings.name}" not found'),
        ),
      ),
    );
  },
  onUnknownRoute: (settings) {
    // Fallback for unknown routes
    return MaterialPageRoute(
      builder: (_) => const NotFoundScreen(),
    );
  },
)
```

## Route Guards

Implement route guards with onGenerateRoute.

```dart
MaterialApp(
  onGenerateRoute: (settings) {
    // Check authentication
    if (settings.name == '/profile' && !isAuthenticated) {
      return MaterialPageRoute(builder: (_) => const LoginScreen());
    }
    
    // Handle route
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case '/profile':
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      default:
        return MaterialPageRoute(builder: (_) => const NotFoundScreen());
    }
  },
)
```

## Key Points

- Use `routes` map for simple static routes
- Use `onGenerateRoute` for dynamic route generation
- Pass arguments via `Navigator.pushNamed(arguments: ...)`
- Access arguments via `ModalRoute.of(context)?.settings.arguments`
- Use `onUnknownRoute` as fallback for unknown routes
- Implement route guards in `onGenerateRoute`
- Use typed arguments classes for better type safety
- Named routes make navigation more maintainable

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/navigator.dart
- https://docs.flutter.dev/development/ui/navigation
-->

---
name: features-router
description: Flutter Router API - declarative routing, RouterDelegate, and route configuration
---

# Router API

Flutter's Router API provides declarative routing for navigation.

## Router Widget

Use Router widget for declarative routing.

```dart
MaterialApp.router(
  routerConfig: _router,
  title: 'My App',
)

final _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/detail/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return DetailScreen(id: id);
      },
    ),
  ],
);
```

## GoRouter (go_router package)

Popular declarative routing package.

```dart
import 'package:go_router/go_router.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/detail/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return DetailScreen(id: int.parse(id));
      },
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
      routes: [
        GoRoute(
          path: 'profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    ),
  ],
  errorBuilder: (context, state) => const NotFoundScreen(),
);

// Usage
MaterialApp.router(
  routerConfig: router,
)
```

## Navigation with GoRouter

```dart
// Navigate
context.go('/detail/123');

// Push (add to stack)
context.push('/detail/123');

// Pop
context.pop();

// Replace
context.go('/home', extra: {'data': 'value'});

// Access parameters
final id = GoRouterState.of(context).pathParameters['id'];
final query = GoRouterState.of(context).uri.queryParameters['search'];
```

## Route Guards

Implement route guards with GoRouter.

```dart
final router = GoRouter(
  redirect: (context, state) {
    final isLoggedIn = authService.isAuthenticated;
    final isLoginRoute = state.matchedLocation == '/login';
    
    if (!isLoggedIn && !isLoginRoute) {
      return '/login';
    }
    
    if (isLoggedIn && isLoginRoute) {
      return '/';
    }
    
    return null; // No redirect
  },
  routes: [...],
);
```

## Route Configuration

```dart
GoRoute(
  path: '/detail/:id',
  name: 'detail', // Named route
  builder: (context, state) {
    final id = state.pathParameters['id']!;
    return DetailScreen(id: id);
  },
  redirect: (context, state) {
    // Redirect logic
    return null;
  },
)
```

## Key Points

- Use `Router` widget for declarative routing
- Use `GoRouter` package for easier route management
- Define routes declaratively
- Use path parameters for dynamic routes
- Use query parameters for optional data
- Implement route guards with `redirect`
- Use `context.go()` for navigation
- Use `context.push()` to add to navigation stack

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/router.dart
- https://pub.dev/packages/go_router
-->

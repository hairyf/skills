---
name: features-material-app
description: MaterialApp widget, Theme, ThemeData, and Material Design theming
---

# Material App

`MaterialApp` is the main widget for Material Design applications. It provides theme, navigation, and other app-wide features.

## MaterialApp

Basic Material app setup.

```dart
MaterialApp(
  title: 'My App',
  theme: ThemeData(
    colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
    useMaterial3: true,
  ),
  home: const HomeScreen(),
)
```

## Theme Configuration

### Basic Theme

```dart
MaterialApp(
  theme: ThemeData(
    // Color scheme
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.light,
    ),
    
    // Typography
    textTheme: TextTheme(
      headlineLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
      bodyLarge: TextStyle(fontSize: 16),
    ),
    
    // Component themes
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.blue,
      foregroundColor: Colors.white,
    ),
    
    // Use Material 3
    useMaterial3: true,
  ),
  home: const HomeScreen(),
)
```

### Dark Theme

```dart
MaterialApp(
  theme: ThemeData.light(),
  darkTheme: ThemeData.dark(),
  themeMode: ThemeMode.system, // system, light, dark
  home: const HomeScreen(),
)
```

## ColorScheme

Material 3 color scheme.

```dart
ColorScheme.fromSeed(
  seedColor: Colors.blue,
  brightness: Brightness.light,
)

// Access colors
Theme.of(context).colorScheme.primary
Theme.of(context).colorScheme.secondary
Theme.of(context).colorScheme.surface
Theme.of(context).colorScheme.error
Theme.of(context).colorScheme.onPrimary
```

## ThemeData Properties

```dart
ThemeData(
  // Colors
  primaryColor: Colors.blue,
  scaffoldBackgroundColor: Colors.white,
  
  // Typography
  fontFamily: 'Roboto',
  textTheme: TextTheme(...),
  
  // Component themes
  appBarTheme: AppBarTheme(...),
  buttonTheme: ButtonThemeData(...),
  cardTheme: CardTheme(...),
  inputDecorationTheme: InputDecorationTheme(...),
  
  // Material 3
  useMaterial3: true,
  
  // Other
  visualDensity: VisualDensity.adaptivePlatformDensity,
)
```

## Using Theme

Access theme in widgets.

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
        style: theme.textTheme.headlineMedium?.copyWith(
          color: colorScheme.onPrimary,
        ),
      ),
    );
  }
}
```

## Theme Extension

Create custom theme extensions.

```dart
class AppColors extends ThemeExtension<AppColors> {
  final Color customColor;

  AppColors({required this.customColor});

  @override
  AppColors copyWith({Color? customColor}) {
    return AppColors(customColor: customColor ?? this.customColor);
  }

  @override
  AppColors lerp(ThemeExtension<AppColors>? other, double t) {
    if (other is! AppColors) return this;
    return AppColors(
      customColor: Color.lerp(customColor, other.customColor, t)!,
    );
  }
}

// Usage
MaterialApp(
  theme: ThemeData(
    extensions: [
      AppColors(customColor: Colors.purple),
    ],
  ),
)

// Access
final appColors = Theme.of(context).extension<AppColors>();
final customColor = appColors?.customColor;
```

## MaterialApp Properties

```dart
MaterialApp(
  title: 'App Title',
  theme: ThemeData.light(),
  darkTheme: ThemeData.dark(),
  themeMode: ThemeMode.system,
  debugShowCheckedModeBanner: false,
  home: HomeScreen(),
  initialRoute: '/',
  routes: {
    '/': (context) => HomeScreen(),
    '/detail': (context) => DetailScreen(),
  },
  onGenerateRoute: (settings) {
    // Custom route generation
  },
  navigatorObservers: [MyNavigatorObserver()],
  builder: (context, child) {
    // Wrap app with additional widgets
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
      child: child!,
    );
  },
)
```

## Key Points

- Use `MaterialApp` as the root widget for Material Design apps
- Configure `theme` and `darkTheme` for light/dark modes
- Use `ColorScheme.fromSeed()` for Material 3 color schemes
- Access theme via `Theme.of(context)`
- Use `ThemeExtension` for custom theme properties
- Set `useMaterial3: true` for Material 3 design
- Configure component themes in `ThemeData`
- Use `themeMode` to control light/dark theme switching

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/material/app.dart
- https://docs.flutter.dev/development/ui/widgets/material
-->

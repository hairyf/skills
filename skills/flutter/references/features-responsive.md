---
name: features-responsive
description: Flutter responsive design - MediaQuery, LayoutBuilder, responsive layouts, and screen adaptation
---

# Responsive Design

Create layouts that adapt to different screen sizes and orientations.

## MediaQuery

Access device information and screen size.

```dart
class ResponsiveWidget extends StatelessWidget {
  const ResponsiveWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final screenWidth = mediaQuery.size.width;
    final screenHeight = mediaQuery.size.height;
    final orientation = mediaQuery.orientation;
    final padding = mediaQuery.padding;
    final devicePixelRatio = mediaQuery.devicePixelRatio;
    
    return Container(
      width: screenWidth * 0.8,
      height: screenHeight * 0.5,
      padding: EdgeInsets.only(top: padding.top),
    );
  }
}
```

## LayoutBuilder

Build widgets based on available constraints.

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 600) {
      return WideLayout();
    } else {
      return NarrowLayout();
    }
  },
)
```

## Responsive Breakpoints

```dart
class ResponsiveLayout extends StatelessWidget {
  const ResponsiveLayout({super.key});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    
    if (width > 1200) {
      return DesktopLayout();
    } else if (width > 600) {
      return TabletLayout();
    } else {
      return MobileLayout();
    }
  }
}
```

## Orientation Builder

Build widgets based on orientation.

```dart
OrientationBuilder(
  builder: (context, orientation) {
    if (orientation == Orientation.portrait) {
      return PortraitLayout();
    } else {
      return LandscapeLayout();
    }
  },
)
```

## Responsive Grid

```dart
class ResponsiveGrid extends StatelessWidget {
  const ResponsiveGrid({super.key});

  int _getCrossAxisCount(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width > 1200) return 4;
    if (width > 600) return 3;
    return 2;
  }

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: _getCrossAxisCount(context),
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemBuilder: (context, index) => Container(color: Colors.blue),
    );
  }
}
```

## Safe Area

Respect device safe areas.

```dart
SafeArea(
  child: Column(
    children: [
      Text('Content'),
    ],
  ),
)
```

## Key Points

- Use `MediaQuery` to access screen information
- Use `LayoutBuilder` for constraint-based layouts
- Define breakpoints for responsive design
- Use `OrientationBuilder` for orientation changes
- Use `SafeArea` to respect device safe areas
- Test on different screen sizes
- Consider tablet and desktop layouts
- Use flexible layouts that adapt to constraints

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/media_query.dart
- https://docs.flutter.dev/development/ui/layout/responsive
-->

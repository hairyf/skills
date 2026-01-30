---
name: widgets-pageview
description: Flutter PageView - swipeable pages, PageController, and page navigation
---

# PageView

`PageView` displays a scrollable list of pages that users can swipe between.

## Basic PageView

```dart
PageView(
  children: [
    Container(color: Colors.red, child: Center(child: Text('Page 1'))),
    Container(color: Colors.green, child: Center(child: Text('Page 2'))),
    Container(color: Colors.blue, child: Center(child: Text('Page 3'))),
  ],
)
```

## PageController

Control page navigation programmatically.

```dart
class PageViewExample extends StatefulWidget {
  const PageViewExample({super.key});

  @override
  State<PageViewExample> createState() => _PageViewExampleState();
}

class _PageViewExampleState extends State<PageViewExample> {
  final PageController _controller = PageController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: PageView(
            controller: _controller,
            children: [
              Container(color: Colors.red),
              Container(color: Colors.green),
              Container(color: Colors.blue),
            ],
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => _controller.previousPage(
                duration: Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              ),
              child: const Text('Previous'),
            ),
            ElevatedButton(
              onPressed: () => _controller.nextPage(
                duration: Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              ),
              child: const Text('Next'),
            ),
          ],
        ),
      ],
    );
  }
}
```

## PageView.builder

Build pages on demand.

```dart
PageView.builder(
  itemCount: pages.length,
  itemBuilder: (context, index) {
    return Container(
      color: Colors.blue,
      child: Center(child: Text('Page $index')),
    );
  },
)
```

## PageView Properties

```dart
PageView(
  scrollDirection: Axis.horizontal, // horizontal, vertical
  reverse: false, // Reverse scroll direction
  controller: _controller,
  physics: PageScrollPhysics(), // ClampingScrollPhysics, BouncingScrollPhysics
  pageSnapping: true, // Snap to pages
  onPageChanged: (index) {
    print('Page changed to $index');
  },
  children: [...],
)
```

## Initial Page

```dart
PageController(
  initialPage: 2, // Start at page 2
  viewportFraction: 1.0, // Page width fraction (0.0 to 1.0)
)

PageView(
  controller: PageController(initialPage: 1),
  children: [...],
)
```

## Viewport Fraction

Show multiple pages at once.

```dart
PageView(
  controller: PageController(viewportFraction: 0.8),
  children: [
    Container(color: Colors.red),
    Container(color: Colors.green),
    Container(color: Colors.blue),
  ],
)
```

## Key Points

- Use `PageView` for swipeable pages
- Use `PageController` to control navigation
- Use `PageView.builder` for dynamic pages
- Set `scrollDirection` for horizontal/vertical scrolling
- Use `onPageChanged` to track page changes
- Set `viewportFraction` to show multiple pages
- Always dispose `PageController`
- Use `pageSnapping` to snap to pages

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/page_view.dart
- https://docs.flutter.dev/cookbook/navigation/page-view
-->

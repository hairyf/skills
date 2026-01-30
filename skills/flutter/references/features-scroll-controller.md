---
name: features-scroll-controller
description: Flutter ScrollController - programmatic scroll control, scroll listeners, and scroll position management
---

# ScrollController

`ScrollController` provides programmatic control over scrollable widgets.

## Basic Usage

```dart
class ScrollExample extends StatefulWidget {
  const ScrollExample({super.key});

  @override
  State<ScrollExample> createState() => _ScrollExampleState();
}

class _ScrollExampleState extends State<ScrollExample> {
  final ScrollController _controller = ScrollController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      controller: _controller,
      children: [
        // List items
      ],
    );
  }
}
```

## Scroll to Position

```dart
// Jump to position
_controller.jumpTo(500);

// Animate to position
_controller.animateTo(
  500,
  duration: Duration(milliseconds: 300),
  curve: Curves.easeInOut,
);
```

## Scroll Listeners

```dart
@override
void initState() {
  super.initState();
  _controller.addListener(() {
    print('Scroll position: ${_controller.offset}');
    
    // Load more when near bottom
    if (_controller.position.pixels >= 
        _controller.position.maxScrollExtent - 200) {
      loadMore();
    }
  });
}
```

## Scroll Position

```dart
// Get scroll position
final offset = _controller.offset;

// Get max scroll extent
final maxScroll = _controller.position.maxScrollExtent;

// Check if at top
final isAtTop = _controller.position.pixels == 0;

// Check if at bottom
final isAtBottom = _controller.position.pixels >= 
    _controller.position.maxScrollExtent;
```

## Scroll to Top/Bottom

```dart
// Scroll to top
_controller.animateTo(
  0,
  duration: Duration(milliseconds: 300),
  curve: Curves.easeOut,
);

// Scroll to bottom
_controller.animateTo(
  _controller.position.maxScrollExtent,
  duration: Duration(milliseconds: 300),
  curve: Curves.easeOut,
);
```

## Initial Scroll Position

```dart
ScrollController(
  initialScrollOffset: 500, // Start at position 500
  keepScrollOffset: true, // Persist scroll position
)
```

## Multiple Controllers

```dart
final _listController = ScrollController();
final _gridController = ScrollController();

// Sync scrolling
_listController.addListener(() {
  _gridController.jumpTo(_listController.offset);
});
```

## Key Points

- Use `ScrollController` to control scroll position
- Always dispose controllers to prevent leaks
- Use `jumpTo()` for instant scrolling
- Use `animateTo()` for animated scrolling
- Listen to scroll changes with `addListener()`
- Access scroll position via `offset`
- Check scroll extent with `maxScrollExtent`
- Use `initialScrollOffset` to start at specific position

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/scroll_controller.dart
- https://api.flutter.dev/flutter/widgets/ScrollController-class.html
-->

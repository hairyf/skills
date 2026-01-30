---
name: features-explicit-animations
description: Flutter explicit animations - AnimationController, Tween, AnimationBuilder, and custom animations
---

# Explicit Animations

Explicit animations give you full control over animation timing, curves, and values.

## AnimationController

Control animation playback and timing.

```dart
class AnimatedWidget extends StatefulWidget {
  const AnimatedWidget({super.key});

  @override
  State<AnimatedWidget> createState() => _AnimatedWidgetState();
}

class _AnimatedWidgetState extends State<AnimatedWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: () => _controller.forward(),
          child: const Text('Start'),
        ),
        ElevatedButton(
          onPressed: () => _controller.reverse(),
          child: const Text('Reverse'),
        ),
        ElevatedButton(
          onPressed: () => _controller.reset(),
          child: const Text('Reset'),
        ),
      ],
    );
  }
}
```

## Tween

Define animation value range.

```dart
final animation = Tween<double>(
  begin: 0.0,
  end: 1.0,
).animate(_controller);

// Different types
final colorAnimation = ColorTween(
  begin: Colors.red,
  end: Colors.blue,
).animate(_controller);

final sizeAnimation = Tween<double>(
  begin: 50.0,
  end: 200.0,
).animate(_controller);

final offsetAnimation = Tween<Offset>(
  begin: Offset.zero,
  end: Offset(100, 100),
).animate(_controller);
```

## AnimationBuilder

Rebuild widget when animation value changes.

```dart
AnimationBuilder(
  animation: _controller,
  builder: (context, child) {
    return Transform.scale(
      scale: _controller.value,
      child: Container(
        width: 100,
        height: 100,
        color: Colors.blue,
      ),
    );
  },
)

// With Tween
AnimationBuilder(
  animation: Tween<double>(begin: 0, end: 1).animate(_controller),
  builder: (context, child) {
    return Opacity(
      opacity: Tween<double>(begin: 0, end: 1).animate(_controller).value,
      child: Container(...),
    );
  },
)
```

## CurvedAnimation

Apply curves to animations.

```dart
final curvedAnimation = CurvedAnimation(
  parent: _controller,
  curve: Curves.easeInOut,
  reverseCurve: Curves.easeOut,
);

// Common curves
curve: Curves.linear
curve: Curves.easeIn
curve: Curves.easeOut
curve: Curves.easeInOut
curve: Curves.bounceIn
curve: Curves.bounceOut
curve: Curves.elasticIn
curve: Curves.elasticOut
```

## Animation Status Listeners

Listen to animation state changes.

```dart
_controller.addStatusListener((status) {
  if (status == AnimationStatus.completed) {
    // Animation completed
  } else if (status == AnimationStatus.dismissed) {
    // Animation dismissed
  } else if (status == AnimationStatus.forward) {
    // Animation playing forward
  } else if (status == AnimationStatus.reverse) {
    // Animation playing reverse
  }
});

_controller.addListener(() {
  setState(() {
    // Rebuild when animation value changes
  });
});
```

## Complete Example

```dart
class FadeScaleAnimation extends StatefulWidget {
  const FadeScaleAnimation({super.key});

  @override
  State<FadeScaleAnimation> createState() => _FadeScaleAnimationState();
}

class _FadeScaleAnimationState extends State<FadeScaleAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AnimationBuilder(
          animation: _controller,
          builder: (context, child) {
            return Opacity(
              opacity: _fadeAnimation.value,
              child: Transform.scale(
                scale: _scaleAnimation.value,
                child: Container(
                  width: 100,
                  height: 100,
                  color: Colors.blue,
                ),
              ),
            );
          },
        ),
        ElevatedButton(
          onPressed: () {
            if (_controller.isCompleted) {
              _controller.reverse();
            } else {
              _controller.forward();
            }
          },
          child: const Text('Animate'),
        ),
      ],
    );
  }
}
```

## AnimationController Methods

```dart
// Start animation
_controller.forward(); // 0.0 to 1.0
_controller.reverse(); // 1.0 to 0.0

// Control animation
_controller.reset(); // Reset to 0.0
_controller.stop(); // Stop at current value
_controller.repeat(); // Repeat indefinitely

// Check status
_controller.isAnimating
_controller.isCompleted
_controller.isDismissed

// Get value
_controller.value // Current animation value (0.0 to 1.0)
```

## Key Points

- Use `AnimationController` to control animation timing
- Use `Tween` to define value ranges
- Use `AnimationBuilder` to rebuild widgets during animation
- Use `CurvedAnimation` for custom timing curves
- Implement `TickerProviderStateMixin` for single animation
- Implement `TickerProvider` for multiple animations
- Always dispose `AnimationController` to prevent leaks
- Use `addStatusListener` to react to animation state changes
- Use `addListener` to rebuild widgets during animation

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/ticker_provider.dart
- https://docs.flutter.dev/development/ui/animations
-->

---
name: features-hero-animations
description: Flutter Hero animations - Hero widget, shared element transitions between routes
---

# Hero Animations

Hero animations create smooth transitions for widgets that move between routes.

## Basic Hero

Create a hero animation by wrapping widgets with the same tag.

```dart
// First screen
Hero(
  tag: 'avatar',
  child: CircleAvatar(
    radius: 30,
    backgroundImage: NetworkImage('https://example.com/avatar.jpg'),
  ),
)

// Second screen
Hero(
  tag: 'avatar',
  child: CircleAvatar(
    radius: 100,
    backgroundImage: NetworkImage('https://example.com/avatar.jpg'),
  ),
)
```

## Hero Properties

```dart
Hero(
  tag: 'unique-tag', // Must be unique and match between screens
  child: Widget(...),
  flightShuttleBuilder: (context, animation, flightDirection, fromHeroContext, toHeroContext) {
    // Custom transition widget
    return ScaleTransition(
      scale: animation,
      child: child,
    );
  },
  placeholderBuilder: (context, size, child) {
    // Widget shown while hero is transitioning
    return Container(
      width: size.width,
      height: size.height,
      color: Colors.grey,
    );
  },
  transitionOnUserGestures: false, // Allow gesture-based transitions
  createRectTween: (begin, end) {
    // Custom tween for hero bounds
    return RectTween(begin: begin, end: end);
  },
)
```

## Complete Example

```dart
class FirstScreen extends StatelessWidget {
  const FirstScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('First Screen')),
      body: Center(
        child: GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const SecondScreen()),
            );
          },
          child: Hero(
            tag: 'avatar',
            child: CircleAvatar(
              radius: 50,
              backgroundImage: NetworkImage('https://example.com/avatar.jpg'),
            ),
          ),
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  const SecondScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Second Screen')),
      body: Center(
        child: Hero(
          tag: 'avatar',
          child: CircleAvatar(
            radius: 150,
            backgroundImage: NetworkImage('https://example.com/avatar.jpg'),
          ),
        ),
      ),
    );
  }
}
```

## Custom Flight Shuttle

Customize the hero transition widget.

```dart
Hero(
  tag: 'custom-hero',
  flightShuttleBuilder: (context, animation, flightDirection, fromHeroContext, toHeroContext) {
    final hero = flightDirection == HeroFlightDirection.push
        ? toHeroContext.widget
        : fromHeroContext.widget;
    
    return RotationTransition(
      turns: animation,
      child: ScaleTransition(
        scale: animation,
        child: hero,
      ),
    );
  },
  child: Container(...),
)
```

## Multiple Heroes

Use multiple heroes in the same transition.

```dart
// First screen
Column(
  children: [
    Hero(
      tag: 'title',
      child: Text('Title', style: TextStyle(fontSize: 24)),
    ),
    Hero(
      tag: 'image',
      child: Image.network('https://example.com/image.jpg'),
    ),
  ],
)

// Second screen
Column(
  children: [
    Hero(
      tag: 'title',
      child: Text('Title', style: TextStyle(fontSize: 48)),
    ),
    Hero(
      tag: 'image',
      child: Image.network('https://example.com/image.jpg'),
    ),
  ],
)
```

## Hero with List

Hero animations work with ListView items.

```dart
ListView.builder(
  itemBuilder: (context, index) {
    return ListTile(
      leading: Hero(
        tag: 'avatar-$index',
        child: CircleAvatar(...),
      ),
      title: Text('Item $index'),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DetailScreen(index: index),
          ),
        );
      },
    );
  },
)
```

## Key Points

- Use `Hero` widget for shared element transitions
- Tags must be unique and match between screens
- Hero works automatically with Navigator transitions
- Use `flightShuttleBuilder` for custom transition widgets
- Use `placeholderBuilder` to show widget during transition
- Multiple heroes can animate simultaneously
- Hero animations work with any widget, not just images
- Ensure hero widgets have similar visual appearance for best effect

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/heroes.dart
- https://docs.flutter.dev/development/ui/animations/hero-animations
-->

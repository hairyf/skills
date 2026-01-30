---
name: widgets-images
description: Flutter Image widget, AssetImage, NetworkImage, ImageProvider, and image loading
---

# Image Widgets

Flutter provides widgets for displaying images from various sources.

## Image Widget

Display images from different sources.

```dart
// Asset image
Image.asset(
  'assets/images/logo.png',
  width: 100,
  height: 100,
  fit: BoxFit.cover,
)

// Network image
Image.network(
  'https://example.com/image.jpg',
  width: 200,
  height: 200,
  loadingBuilder: (context, child, loadingProgress) {
    if (loadingProgress == null) return child;
    return CircularProgressIndicator(
      value: loadingProgress.expectedTotalBytes != null
          ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
          : null,
    );
  },
  errorBuilder: (context, error, stackTrace) {
    return Icon(Icons.error);
  },
)

// File image
Image.file(
  File('/path/to/image.jpg'),
  width: 100,
  height: 100,
)

// Memory image
Image.memory(
  Uint8List.fromList(imageBytes),
  width: 100,
  height: 100,
)
```

## Image Properties

```dart
Image.asset(
  'assets/images/logo.png',
  width: 200,
  height: 200,
  fit: BoxFit.cover, // cover, contain, fill, fitWidth, fitHeight, none, scaleDown
  alignment: Alignment.center,
  repeat: ImageRepeat.noRepeat, // noRepeat, repeat, repeatX, repeatY
  matchTextDirection: false,
  gaplessPlayback: false, // Keep showing old image while loading new one
  filterQuality: FilterQuality.low, // low, medium, high, none
  isAntiAlias: true,
  frameBuilder: (context, child, frame, wasSynchronouslyLoaded) {
    if (wasSynchronouslyLoaded) return child;
    return AnimatedOpacity(
      opacity: frame == null ? 0 : 1,
      duration: const Duration(milliseconds: 200),
      child: child,
    );
  },
)
```

## ImageProvider

Use ImageProvider for advanced image loading.

### AssetImage

```dart
Image(
  image: AssetImage('assets/images/logo.png'),
  width: 100,
  height: 100,
)

// With package
AssetImage('assets/logo.png', package: 'my_package')
```

### NetworkImage

```dart
Image(
  image: NetworkImage('https://example.com/image.jpg'),
  width: 100,
  height: 100,
)

// With headers
NetworkImage(
  'https://example.com/image.jpg',
  headers: {'Authorization': 'Bearer token'},
)
```

### FileImage

```dart
Image(
  image: FileImage(File('/path/to/image.jpg')),
  width: 100,
  height: 100,
)
```

### MemoryImage

```dart
Image(
  image: MemoryImage(Uint8List.fromList(imageBytes)),
  width: 100,
  height: 100,
)
```

## FadeInImage

Image with fade-in animation.

```dart
FadeInImage.assetNetwork(
  placeholder: 'assets/placeholder.png',
  image: 'https://example.com/image.jpg',
  width: 200,
  height: 200,
  fadeInDuration: const Duration(milliseconds: 300),
  fadeOutDuration: const Duration(milliseconds: 100),
)

FadeInImage.memoryNetwork(
  placeholder: kTransparentImage, // From transparent_image package
  image: 'https://example.com/image.jpg',
)
```

## Image Caching

Precache images for better performance.

```dart
// Precache asset image
precacheImage(
  AssetImage('assets/images/logo.png'),
  context,
);

// Precache network image
precacheImage(
  NetworkImage('https://example.com/image.jpg'),
  context,
).then((_) {
  // Image is cached
});

// Check cache status
final status = await imageProvider.obtainCacheStatus(
  configuration: createLocalImageConfiguration(context),
);
print('Cache status: ${status.status}'); // pending, live, keepAlive
```

## Image Error Handling

```dart
Image.network(
  'https://example.com/image.jpg',
  errorBuilder: (context, error, stackTrace) {
    return Container(
      width: 100,
      height: 100,
      color: Colors.grey[300],
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error, color: Colors.red),
          Text('Failed to load', style: TextStyle(fontSize: 10)),
        ],
      ),
    );
  },
  loadingBuilder: (context, child, loadingProgress) {
    if (loadingProgress == null) return child;
    return Center(
      child: CircularProgressIndicator(
        value: loadingProgress.expectedTotalBytes != null
            ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
            : null,
      ),
    );
  },
)
```

## ImageIcon

Use images as icons.

```dart
ImageIcon(
  AssetImage('assets/icons/custom_icon.png'),
  size: 48,
  color: Colors.blue,
)

ImageIcon(
  NetworkImage('https://example.com/icon.png'),
  size: 48,
)
```

## Key Points

- Use `Image.asset()` for local assets
- Use `Image.network()` for network images
- Use `Image.file()` for file system images
- Use `Image.memory()` for in-memory images
- Use `FadeInImage` for smooth loading transitions
- Precache images for better performance
- Always provide error builders for network images
- Use `BoxFit` to control how images fill their bounds
- Configure image cache size in `ImageCache` if needed

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/image.dart
- https://docs.flutter.dev/development/ui/widgets/images
-->

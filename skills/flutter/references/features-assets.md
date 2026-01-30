---
name: features-assets
description: Flutter assets and resources - asset management, pubspec.yaml, asset loading, and resource handling
---

# Assets and Resources

Flutter provides ways to bundle and access assets in your app.

## pubspec.yaml Configuration

Configure assets in `pubspec.yaml`.

```yaml
flutter:
  assets:
    - assets/images/
    - assets/icons/
    - assets/data/config.json
    - assets/fonts/
  
  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/CustomFont-Regular.ttf
        - asset: assets/fonts/CustomFont-Bold.ttf
          weight: 700
```

## Loading Images

```dart
// Asset image
Image.asset('assets/images/logo.png')

// With package
Image.asset('assets/images/logo.png', package: 'my_package')

// With width and height
Image.asset(
  'assets/images/logo.png',
  width: 100,
  height: 100,
)
```

## Loading Text Files

```dart
import 'package:flutter/services.dart';

Future<String> loadAsset() async {
  return await rootBundle.loadString('assets/data/config.json');
}

// Usage
final config = await loadAsset();
final jsonData = jsonDecode(config);
```

## Loading Binary Files

```dart
import 'package:flutter/services.dart';

Future<ByteData> loadBinaryAsset() async {
  return await rootBundle.load('assets/data/file.bin');
}

// Usage
final data = await loadBinaryAsset();
final bytes = data.buffer.asUint8List();
```

## Asset Images in Code

```dart
// Using AssetImage
final imageProvider = AssetImage('assets/images/logo.png');
Image(image: imageProvider)

// Precache asset image
precacheImage(
  AssetImage('assets/images/logo.png'),
  context,
);
```

## Custom Fonts

```dart
Text(
  'Custom Font',
  style: TextStyle(
    fontFamily: 'CustomFont',
    fontSize: 24,
    fontWeight: FontWeight.bold,
  ),
)
```

## Asset Bundle

Access assets programmatically.

```dart
import 'package:flutter/services.dart';

// Load string
final String data = await rootBundle.loadString('assets/data/file.txt');

// Load binary
final ByteData bytes = await rootBundle.load('assets/data/file.bin');

// Check if asset exists
final bool exists = await rootBundle.load('assets/data/file.txt') != null;
```

## Asset Variants

Flutter automatically selects appropriate asset variants.

```dart
// Automatically selects based on device pixel ratio
Image.asset('assets/images/logo.png')
// Tries: logo.png, logo@2x.png, logo@3x.png

// For different locales
Image.asset('assets/images/flag.png')
// Tries: flag.png, flag_en.png, flag_zh.png
```

## Key Points

- Configure assets in `pubspec.yaml`
- Use `Image.asset()` for images
- Use `rootBundle.loadString()` for text files
- Use `rootBundle.load()` for binary files
- Flutter automatically selects asset variants
- Use `precacheImage()` to preload images
- Assets are bundled with the app
- Use package parameter for package assets

<!--
Source references:
- https://docs.flutter.dev/development/ui/assets-and-images
- https://docs.flutter.dev/development/ui/assets-and-images#bundling-of-assets
-->

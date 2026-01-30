---
name: features-platform-views
description: Flutter platform views - AndroidView, UiKitView, and embedding native views
---

# Platform Views

Platform views allow embedding native Android/iOS views in Flutter.

## AndroidView

Embed Android views in Flutter (Android).

```dart
import 'dart:io';

if (Platform.isAndroid) {
  AndroidView(
    viewType: 'android-view',
    layoutDirection: TextDirection.ltr,
    creationParams: {
      'text': 'Hello from Flutter',
    },
    creationParamsCodec: const StandardMessageCodec(),
    onPlatformViewCreated: (int id) {
      // View created
    },
  ),
}
```

### Android Setup

```kotlin
import io.flutter.plugin.platform.PlatformView
import io.flutter.plugin.platform.PlatformViewFactory
import io.flutter.plugin.common.StandardMessageCodec
import android.view.View
import android.widget.TextView

class NativeView(context: android.content.Context, id: Int, creationParams: Any?): PlatformView {
    private val textView: TextView = TextView(context)
    
    init {
        val params = creationParams as Map<String, Any>?
        textView.text = params?.get("text") as? String ?: "Default"
    }
    
    override fun getView(): View = textView
    
    override fun dispose() {}
}

class NativeViewFactory: PlatformViewFactory(StandardMessageCodec.INSTANCE) {
    override fun create(context: android.content.Context, viewId: Int, args: Any?): PlatformView {
        return NativeView(context, viewId, args)
    }
}

// Register in MainActivity
flutterEngine.platformViewsController.registry.registerViewFactory(
    "android-view",
    NativeViewFactory()
)
```

## UiKitView

Embed iOS views in Flutter (iOS).

```dart
import 'dart:io';

if (Platform.isIOS) {
  UiKitView(
    viewType: 'ios-view',
    creationParams: {
      'text': 'Hello from Flutter',
    },
    creationParamsCodec: const StandardMessageCodec(),
    onPlatformViewCreated: (int id) {
      // View created
    },
  ),
}
```

### iOS Setup

```swift
import Flutter
import UIKit

class NativeViewFactory: NSObject, FlutterPlatformViewFactory {
    func create(withFrame frame: CGRect, viewIdentifier viewId: Int64, arguments args: Any?) -> FlutterPlatformView {
        return NativeView(frame: frame, arguments: args)
    }
}

class NativeView: NSObject, FlutterPlatformView {
    private var _view: UIView
    
    init(frame: CGRect, arguments args: Any?) {
        _view = UIView()
        super.init()
        
        let params = args as? [String: Any]
        let label = UILabel()
        label.text = params?["text"] as? String ?? "Default"
        label.frame = frame
        _view.addSubview(label)
    }
    
    func view() -> UIView {
        return _view
    }
}

// Register in AppDelegate
let factory = NativeViewFactory()
registrar.registerViewFactory("ios-view", factory: factory)
```

## Hybrid Composition

Use hybrid composition for better performance (Android).

```dart
AndroidView(
  viewType: 'android-view',
  hybridComposition: true, // Enable hybrid composition
  creationParams: {...},
  creationParamsCodec: const StandardMessageCodec(),
)
```

## Key Points

- Use `AndroidView` for Android native views
- Use `UiKitView` for iOS native views
- Platform views require platform-specific setup
- Use `creationParams` to pass data to native views
- Handle `onPlatformViewCreated` for view initialization
- Use hybrid composition on Android for better performance
- Platform views have performance considerations
- Test on both platforms when using platform views

<!--
Source references:
- https://docs.flutter.dev/platform-integration/platform-views
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/platform_view.dart
-->

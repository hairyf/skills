---
name: features-platform-channels
description: Flutter platform channels - MethodChannel, EventChannel, and communication with native code
---

# Platform Channels

Platform channels allow Flutter to communicate with platform-specific code (Android/iOS).

## MethodChannel

Call platform methods from Flutter.

### Flutter Side

```dart
import 'package:flutter/services.dart';

class PlatformService {
  static const platform = MethodChannel('com.example/app');

  Future<String> getPlatformVersion() async {
    try {
      final String version = await platform.invokeMethod('getPlatformVersion');
      return version;
    } on PlatformException catch (e) {
      return "Failed to get version: '${e.message}'.";
    }
  }

  Future<void> showNativeDialog() async {
    try {
      await platform.invokeMethod('showDialog', {'message': 'Hello from Flutter'});
    } on PlatformException catch (e) {
      print("Error: ${e.message}");
    }
  }
}
```

### Android Side (Kotlin)

```kotlin
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity: FlutterActivity() {
    private val CHANNEL = "com.example/app"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "getPlatformVersion" -> {
                    result.success(android.os.Build.VERSION.RELEASE)
                }
                "showDialog" -> {
                    val message = call.argument<String>("message")
                    // Show dialog
                    result.success(null)
                }
                else -> {
                    result.notImplemented()
                }
            }
        }
    }
}
```

### iOS Side (Swift)

```swift
import Flutter
import UIKit

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller : FlutterViewController = window?.rootViewController as! FlutterViewController
    let channel = FlutterMethodChannel(name: "com.example/app",
                                      binaryMessenger: controller.binaryMessenger)
    channel.setMethodCallHandler({
      (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in
      if call.method == "getPlatformVersion" {
        result("iOS " + UIDevice.current.systemVersion)
      } else if call.method == "showDialog" {
        let args = call.arguments as? [String: Any]
        let message = args?["message"] as? String
        // Show dialog
        result(nil)
      } else {
        result(FlutterMethodNotImplemented)
      }
    })
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

## EventChannel

Stream events from platform to Flutter.

### Flutter Side

```dart
import 'package:flutter/services.dart';

class EventChannelService {
  static const eventChannel = EventChannel('com.example/events');

  Stream<String> getBatteryLevel() {
    return eventChannel.receiveBroadcastStream().map((dynamic event) => event.toString());
  }
}

// Usage
StreamBuilder<String>(
  stream: EventChannelService().getBatteryLevel(),
  builder: (context, snapshot) {
    if (snapshot.hasData) {
      return Text('Battery: ${snapshot.data}');
    }
    return CircularProgressIndicator();
  },
)
```

### Android Side

```kotlin
import io.flutter.plugin.common.EventChannel

EventChannel(flutterEngine.dartExecutor.binaryMessenger, "com.example/events")
    .setStreamHandler(object : EventChannel.StreamHandler {
        override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
            // Start sending events
            events?.success("Event data")
        }

        override fun onCancel(arguments: Any?) {
            // Stop sending events
        }
    })
```

## BasicMessageChannel

Two-way communication with platform.

```dart
import 'package:flutter/services.dart';

final messageChannel = BasicMessageChannel<String>(
  'com.example/messages',
  StringCodec(),
);

// Send message
await messageChannel.send('Hello from Flutter');

// Set handler
messageChannel.setMessageHandler((message) async {
  return 'Response from Flutter';
});
```

## Key Points

- Use `MethodChannel` for one-time method calls
- Use `EventChannel` for streaming events from platform
- Use `BasicMessageChannel` for two-way communication
- Channel names must match between Flutter and platform code
- Handle `PlatformException` for error cases
- Use `result.notImplemented()` for unsupported methods
- Platform channels are asynchronous
- Use proper codecs for complex data types

<!--
Source references:
- https://docs.flutter.dev/platform-integration/platform-channels
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/services/platform_channel.dart
-->

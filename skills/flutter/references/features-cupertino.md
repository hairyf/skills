---
name: features-cupertino
description: Cupertino widgets - iOS-style widgets, CupertinoApp, and iOS design language
---

# Cupertino Widgets

Cupertino widgets provide iOS-style UI components for Flutter apps.

## CupertinoApp

iOS-style app wrapper.

```dart
CupertinoApp(
  title: 'My App',
  theme: CupertinoThemeData(
    primaryColor: CupertinoColors.systemBlue,
  ),
  home: const HomeScreen(),
)
```

## CupertinoButton

iOS-style button.

```dart
CupertinoButton(
  onPressed: () {
    // Handle press
  },
  child: const Text('Button'),
)

// Filled button
CupertinoButton.filled(
  onPressed: () {},
  child: const Text('Filled Button'),
)
```

## CupertinoNavigationBar

iOS-style navigation bar.

```dart
CupertinoPageScaffold(
  navigationBar: CupertinoNavigationBar(
    middle: const Text('Title'),
    leading: CupertinoNavigationBarBackButton(
      onPressed: () {
        Navigator.pop(context);
      },
    ),
    trailing: CupertinoButton(
      child: const Text('Done'),
      onPressed: () {},
    ),
  ),
  child: const Center(child: Text('Content')),
)
```

## CupertinoPageScaffold

iOS-style page scaffold.

```dart
CupertinoPageScaffold(
  navigationBar: CupertinoNavigationBar(
    middle: const Text('Title'),
  ),
  child: ListView(
    children: [
      ListTile(title: Text('Item 1')),
      ListTile(title: Text('Item 2')),
    ],
  ),
)
```

## CupertinoTabScaffold

iOS-style tab bar.

```dart
CupertinoTabScaffold(
  tabBar: CupertinoTabBar(
    items: const [
      BottomNavigationBarItem(
        icon: Icon(CupertinoIcons.home),
        label: 'Home',
      ),
      BottomNavigationBarItem(
        icon: Icon(CupertinoIcons.search),
        label: 'Search',
      ),
    ],
  ),
  tabBuilder: (context, index) {
    return CupertinoTabView(
      builder: (context) {
        switch (index) {
          case 0:
            return const HomeScreen();
          case 1:
            return const SearchScreen();
          default:
            return const HomeScreen();
        }
      },
    );
  },
)
```

## CupertinoTextField

iOS-style text field.

```dart
CupertinoTextField(
  placeholder: 'Enter text',
  padding: const EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: CupertinoColors.systemGrey6,
    borderRadius: BorderRadius.circular(8),
  ),
  onChanged: (value) {
    // Handle change
  },
)
```

## CupertinoSwitch

iOS-style switch.

```dart
CupertinoSwitch(
  value: _isEnabled,
  onChanged: (value) {
    setState(() {
      _isEnabled = value;
    });
  },
)
```

## CupertinoPicker

iOS-style picker.

```dart
CupertinoPicker(
  itemExtent: 32,
  onSelectedItemChanged: (index) {
    print('Selected: $index');
  },
  children: [
    Text('Option 1'),
    Text('Option 2'),
    Text('Option 3'),
  ],
)
```

## CupertinoDialog

iOS-style dialog.

```dart
showCupertinoDialog(
  context: context,
  builder: (context) => CupertinoAlertDialog(
    title: const Text('Title'),
    content: const Text('Content'),
    actions: [
      CupertinoDialogAction(
        child: const Text('Cancel'),
        onPressed: () => Navigator.pop(context),
      ),
      CupertinoDialogAction(
        isDefaultAction: true,
        child: const Text('OK'),
        onPressed: () => Navigator.pop(context),
      ),
    ],
  ),
)
```

## CupertinoColors

iOS system colors.

```dart
CupertinoColors.systemBlue
CupertinoColors.systemGreen
CupertinoColors.systemRed
CupertinoColors.systemGrey
CupertinoColors.systemGrey2
CupertinoColors.systemGrey3
CupertinoColors.systemGrey4
CupertinoColors.systemGrey5
CupertinoColors.systemGrey6
```

## Key Points

- Use `CupertinoApp` for iOS-style apps
- Use `CupertinoPageScaffold` for iOS-style pages
- Use `CupertinoNavigationBar` for iOS-style navigation
- Use `CupertinoTabScaffold` for iOS-style tabs
- Use `CupertinoButton` for iOS-style buttons
- Use `CupertinoTextField` for iOS-style inputs
- Use `CupertinoColors` for iOS system colors
- Cupertino widgets follow iOS Human Interface Guidelines
- Mix Cupertino and Material widgets as needed

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/cupertino
- https://docs.flutter.dev/development/ui/widgets/cupertino
-->

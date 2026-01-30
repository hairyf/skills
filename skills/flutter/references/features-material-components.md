---
name: features-material-components
description: Material Design components - AppBar, Scaffold, Drawer, BottomNavigationBar, and other Material widgets
---

# Material Components

Flutter provides a comprehensive set of Material Design components.

## Scaffold

Basic Material Design visual structure.

```dart
Scaffold(
  appBar: AppBar(
    title: const Text('Title'),
  ),
  body: const Center(
    child: Text('Body'),
  ),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: const Icon(Icons.add),
  ),
  drawer: Drawer(...),
  bottomNavigationBar: BottomNavigationBar(...),
)
```

## AppBar

Top app bar.

```dart
AppBar(
  title: const Text('Title'),
  leading: IconButton(
    icon: const Icon(Icons.menu),
    onPressed: () {},
  ),
  actions: [
    IconButton(
      icon: const Icon(Icons.search),
      onPressed: () {},
    ),
    IconButton(
      icon: const Icon(Icons.more_vert),
      onPressed: () {},
    ),
  ],
  backgroundColor: Colors.blue,
  foregroundColor: Colors.white,
  elevation: 4,
  flexibleSpace: Container(...), // Custom background
)
```

## Drawer

Navigation drawer.

```dart
Drawer(
  child: ListView(
    padding: EdgeInsets.zero,
    children: [
      const DrawerHeader(
        decoration: BoxDecoration(color: Colors.blue),
        child: Text('Header'),
      ),
      ListTile(
        leading: const Icon(Icons.home),
        title: const Text('Home'),
        onTap: () {
          Navigator.pop(context);
        },
      ),
      ListTile(
        leading: const Icon(Icons.settings),
        title: const Text('Settings'),
        onTap: () {
          Navigator.pop(context);
        },
      ),
    ],
  ),
)
```

## BottomNavigationBar

Bottom navigation bar.

```dart
int _currentIndex = 0;

BottomNavigationBar(
  currentIndex: _currentIndex,
  onTap: (index) {
    setState(() {
      _currentIndex = index;
    });
  },
  items: const [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: 'Home',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.search),
      label: 'Search',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.person),
      label: 'Profile',
    ),
  ],
  type: BottomNavigationBarType.fixed, // fixed, shifting
)
```

## Card

Material Design card.

```dart
Card(
  elevation: 4,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(12),
  ),
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Column(
      children: [
        const Text('Title'),
        const Text('Content'),
      ],
    ),
  ),
)
```

## Dialog

Modal dialog.

```dart
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: const Text('Title'),
    content: const Text('Content'),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('Cancel'),
      ),
      ElevatedButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('OK'),
      ),
    ],
  ),
)
```

## SnackBar

Temporary message at bottom of screen.

```dart
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: const Text('Message'),
    action: SnackBarAction(
      label: 'Action',
      onPressed: () {},
    ),
    duration: const Duration(seconds: 3),
    behavior: SnackBarBehavior.floating,
  ),
)
```

## BottomSheet

Bottom sheet modal.

```dart
showModalBottomSheet(
  context: context,
  builder: (context) => Container(
    padding: const EdgeInsets.all(16),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ListTile(
          leading: const Icon(Icons.share),
          title: const Text('Share'),
          onTap: () {},
        ),
        ListTile(
          leading: const Icon(Icons.delete),
          title: const Text('Delete'),
          onTap: () {},
        ),
      ],
    ),
  ),
)
```

## Key Points

- Use `Scaffold` as the main structure for Material apps
- `AppBar` provides top navigation and actions
- `Drawer` provides side navigation
- `BottomNavigationBar` provides bottom navigation
- Use `Card` for elevated content containers
- Use `showDialog` for modal dialogs
- Use `SnackBar` for temporary messages
- Use `showModalBottomSheet` for bottom sheets

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/material
- https://docs.flutter.dev/development/ui/widgets/material
-->

---
name: widgets-tabs
description: Flutter TabBar and TabController - tab navigation, tab views, and tab management
---

# TabBar and TabController

Flutter provides `TabBar` and `TabController` for tab navigation.

## Basic TabBar

```dart
DefaultTabController(
  length: 3,
  child: Scaffold(
    appBar: AppBar(
      title: Text('Tabs'),
      bottom: TabBar(
        tabs: [
          Tab(icon: Icon(Icons.home), text: 'Home'),
          Tab(icon: Icon(Icons.search), text: 'Search'),
          Tab(icon: Icon(Icons.person), text: 'Profile'),
        ],
      ),
    ),
    body: TabBarView(
      children: [
        HomeScreen(),
        SearchScreen(),
        ProfileScreen(),
      ],
    ),
  ),
)
```

## TabController

Control tabs programmatically.

```dart
class TabExample extends StatefulWidget {
  const TabExample({super.key});

  @override
  State<TabExample> createState() => _TabExampleState();
}

class _TabExampleState extends State<TabExample>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tabs'),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Tab 1'),
            Tab(text: 'Tab 2'),
            Tab(text: 'Tab 3'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          Container(color: Colors.red),
          Container(color: Colors.green),
          Container(color: Colors.blue),
        ],
      ),
    );
  }
}
```

## TabBar Properties

```dart
TabBar(
  controller: _tabController,
  tabs: [...],
  isScrollable: false, // Allow scrolling if tabs overflow
  indicatorColor: Colors.blue, // Indicator color
  indicatorWeight: 2.0, // Indicator thickness
  indicatorSize: TabBarIndicatorSize.tab, // tab, label
  labelColor: Colors.blue, // Selected tab label color
  unselectedLabelColor: Colors.grey, // Unselected tab label color
  labelStyle: TextStyle(fontSize: 16), // Selected tab label style
  unselectedLabelStyle: TextStyle(fontSize: 14), // Unselected tab label style
  onTap: (index) {
    print('Tab $index tapped');
  },
)
```

## TabBarView

```dart
TabBarView(
  controller: _tabController,
  children: [
    HomeScreen(),
    SearchScreen(),
    ProfileScreen(),
  ],
  physics: BouncingScrollPhysics(), // Scroll physics
)
```

## TabController Methods

```dart
// Animate to tab
_tabController.animateTo(2);

// Listen to tab changes
_tabController.addListener(() {
  if (!_tabController.indexIsChanging) {
    print('Tab changed to ${_tabController.index}');
  }
});

// Get current index
final currentIndex = _tabController.index;

// Get previous index
final previousIndex = _tabController.previousIndex;
```

## Key Points

- Use `DefaultTabController` for simple cases
- Use `TabController` for programmatic control
- Implement `SingleTickerProviderStateMixin` for TabController
- Always dispose `TabController`
- Use `TabBar` in AppBar bottom
- Use `TabBarView` for tab content
- Customize appearance with TabBar properties
- Listen to tab changes with `addListener()`

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/material/tabs.dart
- https://docs.flutter.dev/cookbook/design/tabs
-->

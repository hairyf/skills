---
name: features-list-scroll
description: 长列表 scroll-view、list-view、吸顶、嵌套滚动、sticky-header
---

# 长列表与滚动

## scroll-view 与 list-view

- **scroll-view**：灵活，无内置复用机制，适合普通滚动、自定义下拉刷新；可做**嵌套滚动**（见下）。
- **list-view**：基于 recycle-view，**长列表推荐**，可复用节点保证性能；子节点为 **list-item**，支持 **sticky-header** / **sticky-section** 吸顶。
- 微信小程序下 list-view 目前编译为 scroll-view。

## 吸顶

1. **监听滚动 + transform**：在 scroll-view 的 @scroll 中根据滚动位置，对某个 view 设置 transform/position，使其固定在顶部；适合 scroll-view。
2. **sticky-header**：在 **list-view** 内使用 **sticky-header** 作为一级子组件，内容滚动到列表顶部时固定；配合 **sticky-section** 可做分段吸顶（如通讯录字母、多店铺购物车）。
3. **嵌套滚动**：父 scroll-view 设为嵌套模式，子滚动到一定条件后父不再滚动，视觉上类似吸顶，见下。

## 嵌套滚动（scroll-view）

- 外层 **scroll-view** 设置 **type="nested"**，子节点仅能为 **nested-scroll-header** 和 **nested-scroll-body**（各一个子节点）；内层 **scroll-view** 或 **list-view** 设置 **associative-container="nested-scroll-view"**。
- 策略：向下滑先滚外层再内层；向上滑先滚内层再外层。适合“顶部区域 + 下方列表”的左右滑动 swiper-list 等复杂布局。
- 版本：4.11+ 支持；list-view 也可作为内层参与嵌套。

## 下拉刷新

- scroll-view / list-view 均支持 **refresher-enabled**、**refresher-triggered** 及 refresherpulling/refresherrefresh 等事件；可设置 **refresher-default-style="none"** 后用 **slot="refresher"** 自定义下拉样式。

## 关键点

- 长列表优先用 **list-view**；吸顶在 list-view 中用 **sticky-header**；需要“顶部固定 + 下面可滚”的复杂联动用 **嵌套 scroll-view**。

<!--
Source references:
- docs/tutorial/stickynestlist.md
- docs/component/scroll-view.md
- docs/component/list-view.md
- docs/performance.md
-->

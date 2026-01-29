---
name: best-practices-performance
description: App 端性能优化、DOM 数量、动画用 transform、长列表与分批加载
---

# 性能优化

## DOM 数量与层次

- Android 对 DOM 数量和层次更敏感；避免“每个格子一个 view”的写法，可参考日历示例用 **draw API** 整块绘制。
- 组件作者应控制单组件内节点数；HBuilderX 真机运行时会打印页面 dom 数量、排版次数、渲染耗时。
- 正式打包后性能优于调试基座；耗时数据以正式包为准。

## 动画与跟手

- **固定动画**：用 CSS transition 或 animation-view（Lottie）。
- **跟手动效**：优先用 **transform** 移动元素，不要频繁改 left/top/width/height（会触发排版）；建议通过 **ref/getElementById 拿到元素后调用 DOM API** 直接改样式，跳过 Vue 的 diff，保证 16ms 一帧。
- 吸顶等效果可直接监听 scroll 后用 transform 固定 top；list-view 内用 sticky-header 组件。
- 折叠面板等：高度变化建议“高度一次性变、子元素做动画”，避免下方大量元素连续排版导致卡顿。

## 主线程与 onLoad

- 开发者代码**默认在 UI 主线程**运行；onLoad 与进入动画同时发生，onLoad 内不宜大量同步耗时计算。
- **联网、图片加载**在子线程/协程，不会卡 UI；建议在 onLoad 里发起请求，数据回来后更新界面。
- 若 onLoad 仍卡动画，可把部分逻辑挪到 **onReady**。

## 长列表

- **list-view / waterflow** 内置复用，长列表优先使用；避免数千条数据一次性赋给响应式变量导致大量 VNode 与 DOM 创建。
- **uni-recycle-view**：一次性加载极多数据且都要展示时，可控制仅创建有限 VNode；滚动流畅度低于 list-view，且有限制（单 for、等高、无瀑布流等）。
- **分批加载**：初始一大批数据时，可延迟分批渲染，避免首屏卡顿；需配合“闲时加载”，在用户滚动/下拉刷新时暂停分批，避免卡住操作。

## 关键点

- 静态资源放 **static**；编译器会扫描并复制到产物，非静态资源勿放 static。
- 安全软件可能扫描 unpackage 下 kt/class 等，可将 unpackage 设为信任以提升编译速度。

<!--
Source references:
- docs/performance.md
- docs/compiler/README.md
-->

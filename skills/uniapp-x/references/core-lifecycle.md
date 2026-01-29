---
name: core-lifecycle
description: uni-app x 页面生命周期 onLoad、onShow、onReady、onBackPress 等
---

# 页面生命周期

## 顺序概述

1. 根据 **pages.json** 创建页面，style 最早生效。
2. 根据 template 创建首批 DOM（静态部分；v-for 等动态部分不在此批）。
3. 触发 **onLoad**（此时 DOM 未就绪，不宜同步用 ref/getElementById 拿节点）。
4. **onShow**（转场动画开始后）。
5. **onReady**（UI 层完成真实元素创建，可操作 ref、首屏已渲染）。

onReady 与转场动画结束的先后不固定，取决于 DOM 数量与复杂度。

## 常用生命周期

| 生命周期 | 说明 |
|----------|------|
| **onLoad** | 页面创建时触发一次；适合接收 URL 参数、发起请求。此时当前页的 activity 在 Android 上可能尚未就绪。 |
| **onShow** | 页面显示/再次显示时触发（如从后台切回、tab 切换回）。 |
| **onHide** | 页面被遮挡/隐藏时触发。 |
| **onReady** | DOM 已就绪，可安全使用 ref、getElementById。 |
| **onUnload** | 页面卸载时触发。 |
| **onBackPress** | 物理/导航返回键时触发；返回 `true` 可阻止默认返回。**不可使用 async**，否则无法阻止默认行为。iOS 侧滑返回不触发。 |
| **onReachBottom** | 滚动到底部附近时触发；距离可在 pages.json 的 onReachBottomDistance 配置。 |
| **onPageScroll** | 页面滚动时触发（App 端仅当根节点为 scroll-view 时生效）。 |
| **onTabItemTap** | 点击 tab 项时触发；常用于点击**当前** tab 时滚动或刷新。 |

## 组合式与选项式差异

- 组合式：可监听**页面级**生命周期（如 onLoad、onShow）。
- 选项式：不能直接监听页面级生命周期；若组件需要页面生命周期，需用组合式或选项式中的 setup。

组合式中页面「显示/隐藏」使用 **onPageShow / onPageHide**，避免与应用的 onShow/onHide 重名。

## 注意

- onLoad 中不宜大量同步耗时计算，否则会阻塞转场动画；联网、取参可在 onLoad 中发起。
- App-iOS：onLoad 时窗体动画可能已开始，此时改 pageStyle 可能闪烁，建议在 onShow/onReady 中设置。
- Android：onLoad 时当前页 activity 可能未创建完成，取当前页 activity 建议在 onShow 或 onReady。

<!--
Source references:
- docs/page.md
- docs/readme.md
-->

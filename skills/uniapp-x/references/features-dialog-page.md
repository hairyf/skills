---
name: features-dialog-page
description: dialogPage 弹窗页、openDialogPage、closeDialogPage、与主 page 区别
---

# dialogPage

## 适用场景

- 需要覆盖导航栏和 tabBar 的弹框、内置界面。
- 需拦截 back 键、自定义蒙层与交互；替代部分 showModal/actionSheet 或自定义组件弹框。

## 与主 page 的异同

- **相同**：需在 pages.json 注册，有 onLoad 等页面生命周期，可传参、用组件。
- **不同**：
  - 背景固定透明、铺满应用；蒙层由页面内部实现（颜色、是否可点关闭）。
  - 使用 **openDialogPage / closeDialogPage**，不用 navigateTo/navigateBack。
  - **不进入主页面栈**：getCurrentPages() 不包含 dialogPage；需通过主页面 UniPage 的 **getDialogPages()** 获取。
  - **uni.getElementById** 获取的是栈顶主页面，dialogPage 内元素需用 **this.$page.getElementById()**（或 getCurrentInstance()?.proxy?.$page）。
  - Android 上不是独立 activity，与主 page 同属一个 activity。
  - 默认不响应 iOS 侧滑返回；可通过 onBackPress 控制是否阻止 back 键/手势关闭。

## 使用方式

- 调用 **uni.openDialogPage** 打开，可选 **parentPage** 指定所属主页面，不传则默认为当前页。
- 在 **App.onLaunch** 中可打开绑定到首页的 dialogPage（如隐私弹框）；**不可在 main.uts 中**调用 openDialogPage。
- 多个 dialogPage 可层叠；close 时可关闭指定 dialogPage。

## 注意

- showModal、showActionSheet、showLoading 等从 4.61 起部分平台由 dialogPage 实现，调用时会触发前一个 dialogPage 的 onHide，关闭时触发 onShow。
- dialogPage 内调用 navigateTo 等路由 API 会作用在 **parentPage** 上，不作用于 dialogPage 自身。

<!--
Source references:
- docs/api/dialog-page.md
- docs/page.md
-->

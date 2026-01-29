---
name: features-get-current-pages
description: getCurrentPages、UniPage、this.$page、getDialogPages
---

# 页面栈与当前页面

## getCurrentPages()

- 返回**主页面栈**的 **UniPage 数组**（HBuilderX 4.31+ 为 UniPage 对象）。
- **不包含** dialogPage；要获取某主页上的 dialogPage 列表，需先取到该主页面 UniPage，再调用 **getDialogPages()**。

## 当前页面对象

- **选项式**：**this.$page** 为当前页的 UniPage（主页面或 dialogPage 均可）。
- **组合式**：**getCurrentInstance()?.proxy?.$page** 为当前页 UniPage。
- 用于在任意页面/组件内获取当前页实例，进而调用 getElementById、getDialogPages、setPageStyle 等。

## UniPage 能力

- 获取/设置 **pageStyle**（如导航栏、背景色）。
- **getElementById** / **getElement**：获取该页面内元素。
- **getDialogPages()**：获取该主页面上的 dialogPage 列表。
- 高宽、安全区等，见 [unipage](https://doc.dcloud.net.cn/uni-app-x/api/unipage.html) 文档。

## 关键点

- 需要“当前页”时优先用 **this.$page** / **getCurrentInstance()?.proxy?.$page**，避免自己维护页面引用。
- 要操作 dialogPage 内元素时，必须在 **该 dialogPage 的 $page** 上调用 getElementById，不能用 uni.getElementById（只认主页面栈顶）。

<!--
Source references:
- docs/api/get-current-pages.md
- docs/api/unipage.md
- docs/api/dialog-page.md
-->

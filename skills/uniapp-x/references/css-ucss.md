---
name: css-ucss
description: uvue 样式、flex 布局、样式不继承、选择器与优先级
---

# uvue CSS（ucss）

## 能力范围

- **App 端**：实现的是 Web CSS 的**子集**（常称 ucss）；编译到 Web/小程序时可使用完整 CSS，编译器会做重置以与 ucss 行为一致。
- 布局：仅支持 **flex** 和**绝对定位**；选择器仅支持 **class**，不支持 tag、#id、[attr] 等；**样式不继承**。

## flex 方向

- 与 W3C 不同，uni-app x **全平台默认 flex-direction 为 column（竖排）**。
- 横排需显式写 `flex-direction: row`；可在 App.uvue 中定义 `.uni-row` / `.uni-column` 全局 class 方便使用。

## 页面级滚动

- **App 端**：页面本身不滚动，需在需要滚动的区域使用 **scroll-view**（或 list-view）；整页滚动可在根节点包一层 `scroll-view`，并设 `style="flex:1"` 铺满。
- 若根节点是 scroll-view，则 onPageScroll、onReachBottom、uni.pageScrollTo 等才在 App 端生效；根节点为 list-view 时用 list-view 自带滚动 API。
- Web/小程序有页面滚动，可按需用条件编译在 App 端包 scroll-view。

## 样式不继承

- 文字样式必须写在 **`<text>`** 上，写在父 `<view>` 上不会影响子节点。
- 直接写在 view 内的文字会被编译器包一层 text，该 text 无样式，故无法通过父 view 的 color 等改变文字样式；需在 text 上写 style 或 class。

## 优先级与 scoped

- **内联 style > class**；class 之间遵循常规优先级；`!important` 仅可在 class 里使用，不可在 style 属性里用。
- App/小程序：页面样式可作用到当前页及子组件；组件样式仅作用当前组件。
- Web：页面与组件样式隔离，需影响子组件时用 **:deep()** / **::v-deep**。HBuilderX 5+ 有统一隔离策略文档。

## 层级与方法

- App 仅对**同层兄弟节点**支持 **z-index** 调节层级，不支持脱离 DOM 树任意层级。
- 支持的 CSS 方法：url()、rgb()、rgba()、var()、env() 等，详见官方「css 方法」文档。

## 关键点

- 布局以 flex 为主；根节点用 scroll-view 实现整页滚动并设 flex:1。
- 文字颜色、字号等一律写在 `<text>` 上；容器用 view，不依赖继承。
- 跨端时注意 Web 与 App 在滚动、scoped、默认 flex 方向上的差异。

<!--
Source references:
- docs/css/README.md
- docs/vue/README.md
- docs/readme.md
-->

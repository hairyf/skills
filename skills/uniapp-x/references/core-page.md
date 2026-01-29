---
name: core-page
description: uni-app x 页面文件、构成、pages.json 与页面实例
---

# 页面与 uvue

## 页面文件

- 页面文件后缀为 **`.uvue`**，每个 uvue 文件均为符合 Vue SFC 规范的 Vue 文件。
- uni-app x 仅支持 `.uvue` 页面，不支持与老版 vue 页面混用（因 App 端无 JS 引擎、为原生渲染）。
- 页面必须在 **`pages.json`** 中注册，否则不会被打包；第一个页面为首页（启动页）。

## 页面内容构成

一个 uvue 页面包含三个根节点：

- **`<template>`**：模板，使用 uni 内置组件或自定义组件。
- **`<script>`**：逻辑，仅能写 UTS；支持 `<script setup>`（组合式）或 `export default {}`（选项式）。
- **`<style>`**：样式，App 端为 ucss 子集（见 [css-ucss](css-ucss.md)）。

示例（组合式）：

```vue
<template>
  <view class="content">
    <button @click="buttonClick">{{ title }}</button>
  </view>
</template>

<script setup>
  let title = ref("Hello world")
  const buttonClick = () => {
    title.value = "按钮被点了"
  }
  onLoad(() => {})
</script>

<style>
  .content {
    width: 750rpx;
    background-color: white;
  }
</style>
```

## pages.json

- 配置**首页**、页面路径、窗口样式、原生导航栏、tabBar 等。
- 新建/删除页面时需同步增删 `pages` 中的项；HBuilderX 新建页面会自动注册。
- 首页由 `pages` 数组**第一项**决定；每个页面可有 `style`（如 `navigationBarTitleText`）。

## 页面对象与栈

- 运行时每个打开页面对应一个 **UniPage** 实例。
- **`getCurrentPages()`** 返回当前页面栈（UniPage 数组）。
- 页面内可通过 `this.$page` 或 `getCurrentInstance()` 获取当前页面实例。

## 弹窗页

- 非小程序平台支持 **dialogPage**：在主页面上弹出的全屏、背景透明的模态子页面。
- App-Android 下每个页面为全屏 activity，不支持透明；需透明时使用 dialogPage。

## 关键点

- 仅 `.uvue` 可作为页面；script 仅支持 UTS。
- 页面即组件 + pages.json 注册 + 页面生命周期（onLoad、onShow、onReady 等）。
- 通过 props 接收页面参数（HBuilderX 4.71+）；页面也可作为组件嵌入（宽屏适配等）。

<!--
Source references:
- docs/page.md
- docs/readme.md
- docs/vue/README.md
-->

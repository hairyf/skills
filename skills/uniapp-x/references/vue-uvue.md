---
name: vue-uvue
description: uvue 概述、SFC、组合式与选项式 API
---

# uvue 概述

## 是什么

uvue 是 uni-app x 的页面/组件格式，基于 **Vue 单文件组件（SFC）**，三个根节点：

1. **`<template>`**：模板，使用 uni 组件或自定义组件。
2. **`<script>`**：仅支持 UTS（lang 写别的也按 UTS 编译）；可选 `setup` 表示组合式。
3. **`<style>`**：样式，支持 less/scss/stylus；App 端为 ucss 子集。

Vue/uni 的 API（如 ref、onLoad）**无需 import**，由 uni-app x 自动注入。

## 组合式 API（推荐）

```vue
<script setup>
  let title = ref("Hello world")
  const buttonClick = () => {
    title.value = "按钮被点了"
  }
  onLoad(() => {})
</script>
```

- 更灵活、代码更短；可监听页面生命周期（onLoad、onShow 等）。
- 新页面/组件建议直接用组合式；蒸汽模式（Vapor）仅支持组合式。

## 选项式 API

```vue
<script>
  export default {
    data() {
      return { title: "Hello world" }
    },
    onLoad() {},
    methods: {
      buttonClick() {
        this.title = "按钮被点了"
      }
    }
  }
</script>
```

- 适合复用已有选项式代码；App.uvue、uts 组件插件的入口目前仅支持选项式。
- `export default {}` **外部**的代码在应用启动时执行，且不随页面回收，不宜写复杂逻辑。

## Class 与 Style 绑定

- 支持 **UTSJSONObject** 和 **Map** 绑定；App-Android 上 Map 性能更好。
- 单文件组件 `<style>` 中可用 **v-bind()** 绑定 script 中的变量（Web 4.13+，App 部分版本支持，以文档为准）。

## 深度选择器

- 需影响子组件样式时，使用 **`:deep()`** 或 **`::v-deep`**；Web 上 style 会自动加 scoped，需用深度选择器；App/小程序页面可直接作用子组件，深度选择器在部分版本仅作后代选择器。

## 关键点

- 仅能有一个 `<script>`；组合式与选项式不能分两个 script，但可在同一文件内混用（选项式里用 setup 选项，或组合式里用 defineOptions）。
- 选项式里页面「显示/隐藏」用 onShow/onHide；组合式里用 **onPageShow/onPageHide** 避免与应用生命周期重名。

<!--
Source references:
- docs/vue/README.md
- docs/readme.md
- docs/page.md
-->

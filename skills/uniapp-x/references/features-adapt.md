---
name: features-adapt
description: 宽屏适配、leftWindow/rightWindow、页面作为组件、窗体通信
---

# 宽屏适配

## 两种方案

### 一、页面窗体级（仅 Web）

- 在 **pages.json** 中配置 **leftWindow**、**rightWindow**、**topWindow**，与主窗体（mainWindow）组成多窗体布局；根据屏幕宽度自动显示/隐藏。
- 各窗体独立运行、可单独刷新；窗体间通过 **uni.$emit** / **uni.$on** 通信。
- 适用：固定多栏布局（如后台、文档站）。示例：hello uni-app x 的 Web 版上左右三栏。

### 二、组件级适配（HBuilderX 4.71+ 全平台）

- 将**页面作为组件**嵌入当前页：`import DetailPage from '@/pages/detail/detail.uvue'`，在 template 中使用 `<DetailPage />`。
- 宽屏时左侧列表、右侧详情：列表页内用条件或布局，右侧放详情页组件；通过 props 传参，无需 onLoad。
- 判断“当前是页面还是组件”：`this.$page.vm === this` 为 true 表示作为页面渲染。
- 示例与插件见官方「宽屏适配」文档与插件市场。

## 窗体通信（Web 多窗体）

```ts
// 发送
uni.$emit('updateData', { data: 'value' })

// 接收
uni.$on('updateData', (data) => { ... })
```

- 同一应用内页面/dialogPage 间也可用 **uni.$on / uni.$emit** 做事件总线式通信。

## 关键点

- App/小程序无 leftWindow 等，宽屏用**组件级**方案；Web 可用窗体级或组件级。
- 页面作组件时无页面生命周期（onLoad 等），仅组件生命周期；若需参数用 props 传入。

<!--
Source references:
- docs/adapt.md
- docs/page.md
-->

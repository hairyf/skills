---
name: features-idref
description: 组件标志 id、ref、UniElement、createXXXContext、getElementById
---

# 组件标志与获取实例

## 概念对应

- **id**：Web/小程序中用于标识元素；Web 用 **document.getElementById**，小程序用 **uni.createXXXContext(id)** 或 **createSelectorQuery**。
- **ref**：Vue 中用于获取组件或 DOM 实例；选项式 **this.$refs.xxx**，组合式 **ref()** 变量。在 uni-app x 中，**内置组件** ref 得到的是 **UniElement**（或 UniXxxElement），**自定义组件** 得到的是 **ComponentPublicInstance**。
- **UniElement**：uni-app x 对内置组件的封装，可调用组件方法（如 video 的 play、pause）。

## uni-app x 中的用法

- **getElementById**：**UniPage** 上有 **getElementById(id)**，获取该页面内指定 id 的元素（返回 UniElement 等）；**uni.getElementById** 仅获取**当前栈顶主页面**内元素，无法获取 dialogPage 内元素，dialogPage 内需用 **this.$page.getElementById()**。
- **ref**：模板写 `ref="xxx"`，script 中声明对应类型（如 `ref<UniVideoElement \| null>(null)`），通过 **xxx.value** 或 **this.$refs.xxx** 调用组件方法。
- **createVideoContext 等**：小程序风格 API，通过 id 获取上下文，在部分平台可用；与 ref 二选一即可。

## 类型提示

- 内置组件 ref 类型为 **Uni + 组件驼峰名 + Element**（如 UniSliderElement、UniScrollViewElement），便于调用组件方法与属性。
- 自定义组件需通过 **defineExpose** 暴露方法，父组件 ref 类型为 **ComponentPublicInstance** 或对应 ComponentPublicInstance 子类型。

## 关键点

- 操作**当前页**内元素：主页面用 **uni.getElementById** 或 **ref**；dialogPage 内必须用 **this.$page.getElementById** 或 ref。
- 调用内置组件方法时，ref 类型写对才有方法和属性提示。

<!--
Source references:
- docs/tutorial/idref.md
- docs/api/get-element-by-id.md
- docs/vue/component.md
-->

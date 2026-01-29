---
name: vue-component
description: uvue 组件创建、easycom、手动引用、ref 与 defineExpose
---

# 组件

## 创建与引用

- **easycom**：组件放在 `components/组件名/组件名.uvue` 或 `uni_modules/插件id/components/.../组件名.uvue`，符合「组件名/组件名.(vue|uvue)」即可**无需 import 和注册**，直接在 template 中使用。
- **手动引用**：不符合 easycom 时，在 script 中 `import 组件 from '路径'`，在 `components` 中注册，template 中使用组件标签。

## ref 与类型

- **内置组件**（如 scroll-view、slider）：`ref<UniScrollViewElement | null>(null)` 等，类型为「Uni + 组件驼峰名 + Element」。
- **普通 DOM 元素**（view、text）：`ref<UniElement | null>(null)` 或 `ref<UniElement[] | null>(null)`。
- **自定义组件**：`ref<ComponentPublicInstance | null>(null)`；easycom 组件类型为「标签驼峰 + ComponentPublicInstance」，如 `UniDataCheckboxComponentPublicInstance`。

## 调用子组件方法

- **内置组件 / easycom 组件**：通过 `this.$refs.xxx` 拿到实例并 as 成对应类型，用 `.` 调用方法或设置属性。
- **非 easycom 自定义组件**：通过 `this.$refs.xxx.$callMethod('方法名', 参数)` 调用；无类型提示，性能不如 easycom 的强类型调用。
- 子组件需通过 **defineExpose** 显式暴露方法或数据，父组件才能通过 ref 访问。

## 组件与页面的区别

- 组件**无** onLoad、onShow 等页面生命周期，**有** mounted、unmounted 等组件生命周期。
- 组合式下，组件可监听**其所在页面**的页面生命周期（如 onPageShow）；选项式不能。
- 页面需在 pages.json 注册；组件不需要。

## 关键点

- 新组件建议放在 components 或 uni_modules 下并符合 easycom 规范，便于直接使用和类型推断。
- ref 类型写对才能有代码提示和校验；避免把 swiper 等组件的 ref 写成 `UniElement`。
- 同目录下同时存在 .vue 与 .uvue 时，uni-app x 优先使用 .uvue。

<!--
Source references:
- docs/vue/component.md
- docs/component/README.md
-->

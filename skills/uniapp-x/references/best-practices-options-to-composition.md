---
name: best-practices-options-to-composition
description: 选项式 API 转组合式 API 的改造要点与注意事项
---

# 选项式转组合式

## 改造原则

- 只做**语法层面**转换，不改变业务逻辑；不删减代码与注释。
- 组合式中**所有函数和变量必须先定义再调用**，顺序不对要按依赖调整。
- **不需要 import** vue 与 uni-app-x 的 API（ref、onLoad、onMounted 等），框架会自动注入。

## 生命周期对应

| 选项式 | 组合式 |
|--------|--------|
| onShow / onHide（页面） | onPageShow / onPageHide |
| beforeUnmount / mounted / unmounted | onBeforeUnmount / onMounted / onUnmounted |
| created | 用 `<script setup>` 顶层代码直接执行 |
| onPullDownRefresh | 作为页面生命周期函数处理，不要写成普通方法 |

## ref 类型

- **内置组件**（scroll-view、slider 等）：`ref<UniScrollViewElement \| null>(null)` 等，类型为「Uni + 驼峰组件名 + Element」。
- **DOM 元素**（view、text）：`ref<UniElement \| null>(null)`。
- **自定义组件**：`ref<ComponentPublicInstance \| null>(null)`。
- 每个 ref 单独声明，变量名与模板中 ref 一致，用 `xxx.value` 访问；避免变量名与 import 的组件名重复。

## 子组件方法暴露

- 组合式下子组件方法**不会**自动暴露给父组件；需在子组件中 **defineExpose** 显式暴露，父组件才能通过 ref 调用。

## 注意

- **onBackPress** 不能使用 async，否则无法阻止默认返回。
- 选项式里 type 定义在 `export default {}` 外会变成应用级全局，略影响性能；组合式里 type 可写在文件内或单独模块。

<!--
Source references:
- docs/vue/README.md
- docs/page.md
-->

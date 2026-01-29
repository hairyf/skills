---
name: features-component-overview
description: uni-app x 组件分类、内置组件、自定义组件、easycom、uts 组件
---

# 组件概述

## 分类

1. **标准组件**
   - **内置组件**：view、text、button、scroll-view、input 等，无需引用和注册，直接使用。
   - **ext 组件**：文档在官方，但未内置到引擎，需下载到项目；多为小程序有而 App 不常用的组件，如 animation-view。

2. **自定义组件**
   - **前端 uvue 组件**：按 Vue 规范写的 .uvue/.vue 文件，一般放 components 或 uni_modules，通过 easycom 或手动 import 使用。
   - **uts 原生组件**：App 端专用，由原生开发者按 uts 组件规范编写，把原生 view 嵌入 uvue 页面；对使用者而言用法与普通组件一致，无需 import 注册。

## 使用方式

- **内置组件**：直接写标签，如 `<view>`、`<text>`。
- **easycom 组件**：放在 `components/组件名/组件名.uvue` 或 uni_modules 约定路径下，直接写 `<组件名>`。
- **非 easycom 组件**：import + 在 components 中注册后再使用。
- **uts 原生组件**：插件安装后按文档写标签即可。

## 组件名与属性

- 组件名、属性名均**小写**，单词间用连字符 `-`。
- 组件有属性、事件、vue 指令（v-if、v-for、:prop 等）；事件用 `@事件名`，属性用 `v-bind` 或 `:` 绑定响应式数据。

## 兼容 uni-app 与 uni-app x

- 可同时提供 .vue 与 .uvue，分别给老版与 x 用；或单文件 .vue 内用条件编译区分。
- 单 .vue 时需 `lang="ts"` 以便在老版中写类型；x 会忽略 lang 按 uts 编译。同目录下 .uvue 优先于 .vue。

## 关键点

- 优先用内置组件 + easycom 规范的自定义组件，便于维护和类型提示。
- 调用子组件方法：内置/easycom 用 ref + 对应 Element 类型；其他用 $callMethod；子组件需 defineExpose 暴露。

<!--
Source references:
- docs/component/README.md
- docs/readme.md
- docs/vue/component.md
-->

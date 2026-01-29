---
name: uts-overview
description: UTS 语言概述、类型声明、变量常量、与 TS 的差异
---

# UTS 概述

## 是什么

UTS（uni type script）是跨平台、强类型的现代编程语言，在不同平台编译为：

- Web/小程序 → JavaScript
- Android → Kotlin
- iOS → Swift
- 鸿蒙 → ArkTS

uni-app x 中逻辑层使用 UTS，不能写 JS（Android 无 JS 引擎）。与 TS 语法接近，但为跨端做了约束与平台增补，不能完全等同 TS。

## 变量与常量

```ts
let str: string = "hello"   // 可重新赋值
str = "hello world"

const s: string = "hi"      // 只读，不能重新赋值
```

- 类型用冒号 `: 类型` 声明；左右可加空格。
- 方法参数与返回值同样用冒号：`function test(score: number): boolean { ... }`，无返回值用 `: void`。

## data 中的类型（选项式）

vue 的 `data()` 里冒号用于赋值，不能用 `let x: number` 形式。可用：

- **字面量推导**：`n1: 0` 推导为 number。
- **as 声明**：`n2: null as number | null`、`year: date.getFullYear() as number`。

## 类型判断与安全调用

- **typeof**：判断 boolean、number、string、function；数组用 `typeof` 得 `"object"`，需用 `Array.isArray()` 或 `instanceof Array`。
- **instanceof**：判断类型，如 `x instanceof Date`、`x instanceof UTSJSONObject`。
- **可选链**：可为 null 的类型需用 `?.`，否则编译报错，如 `s?.length`。

## 字面量推导与注意

- 直接赋字面量可不写类型：`let s = "hello"` → string；`let b = true` → boolean。
- 数字、数组建议显式声明类型，避免跨平台推导差异：`let n: number = 1`、`let a: Array<string> = ["a","b"]`。
- 对象字面量在 4.31+ 可根据上下文推导为 type；此前多推导为 UTSJSONObject。

## 与 TS 的差异

- 并非“TS 直接编译到各端”，而是抽象各端共性 + 条件编译支持平台特性。
- 联合类型仅支持 `| null`，不支持任意多类型联合。
- 详见官方 [uts 与 ts 的差异](https://doc.dcloud.net.cn/uni-app-x/uts/uts_diff_ts.html) 文档。

## 关键点

- 所有变量、参数、返回值、data 项、事件参数均需有类型或可推导。
- 避免在 `export default {}` 外写过多逻辑，会随应用启动执行且不随页面回收。
- 跨平台项目建议「先定义后使用」，不依赖平台差异的变量提升行为。

<!--
Source references:
- docs/uts/README.md
- docs/readme.md
-->

---
name: uts-function-module
description: UTS 函数定义、异常 try-catch、模块 export/import
---

# UTS 函数与模块

## 函数定义

- **函数声明**：`function name(x: string, y: number): string { return ... }`；除返回 void 外需标明返回类型。
- **函数表达式**：`const fn = function(x: string): number { ... }`。
- **箭头函数**：`(s) => s.length`；匿名、简写；组合式里推荐箭头函数以保持作用域一致。
- 4.31+ 支持函数返回值与参数数量自动推导；多分支返回不同类型时需手写返回类型或 any。

## 异常处理

- **throw**：`throw new Error("msg")`。
- **try-catch-finally**：`try { ... } catch (e: Error) { ... } finally { ... }`。
- **iOS**：Swift 的 try 语法与 UTS 不同，在 iOS 平台使用 try 时见官方 [uts-for-ios](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-for-ios.html#try) 文档。

## 模块 export / import

- **export**：`export const name = "x"`、`export function fn(){}`、`export default class C{}`；export 需在模块顶层。
- **import**：`import { name, fn } from './a.uts'`、`import * as M from './a.uts'`、`import C from './a.uts'`；可用 **as** 别名。
- 一个文件可有多个 export，但仅一个 **export default**；default 对应导入时无需花括号。
- 用于拆分 store、工具库、类型定义等；页面/组件中 import 后使用。

## 关键点

- 跨平台时避免在模块顶层写仅单平台可用的代码，可放到条件编译或运行时判断中。
- 选项式中 type 定义在 export default 外会变成应用级全局，组合式或单独 .uts 中定义可缩小作用域。

<!--
Source references:
- docs/uts/function.md
- docs/uts/exception.md
- docs/uts/module.md
-->

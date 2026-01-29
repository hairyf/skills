---
name: uts-data-type
description: UTS 数据类型 boolean、number、string、Array、UTSJSONObject、type
---

# UTS 数据类型

## 基础类型

- **boolean**：`true` / `false`；不要写成 `bool`。
- **number**：跨平台泛数字，Android 对应 Kotlin Number，iOS 对应 NSNumber；高性能大量运算可用平台类型 Int 等。
- **string**：字符串。
- **any**：任意类型，弱化类型检查。
- **null**：空值；联合类型如 `string | null` 表示可为空。

## 对象与集合

- **Date**、**Array**、**Map**、**Set**：首字母大写；判断具体类型用 `instanceof`。
- **Array** 泛型：`Array<string>`、`Array<number>`；字面量数组建议显式类型，如 `let a: Array<string> = ["a","b"]`。

## UTSJSONObject

- 未提前用 type 定义的 JSON 结构，用 **UTSJSONObject** 表示。
- 访问方式：**下标** `obj["key"]` 或 **keypath** `obj.getString("data[0].name")`。
- 4.41+ 支持 `.` 访问，实际会转成下标；返回值多为 any，使用时需 as 成具体类型。
- 适合兼容 JS 风格或接口结构不固定的场景；有明确结构时更推荐用 **type**，代码提示与性能更好。

## type 自定义类型

```ts
type User = {
  name: string
  age: number
}
let u: User = { name: "zhangsan", age: 12 }
```

- 与接口请求结合：先定义 type，用 HBuilderX「JSON 转 type」或手写，再在 `uni.request` 泛型中传入，得到有类型的响应。
- 4.31+ 对象字面量可根据上下文推导为对应 type；函数返回值也可自动推导（多分支不同类型时需手写返回类型或 any）。

## 平台专有类型

- Kotlin：Int、Long、Float、Double、Byte 等。
- Swift：Int、Double、NSString 等。
- 调用原生 API 时，若入参/返回值要求平台类型，需使用对应类型或条件编译。

## 关键点

- data 里用字面量或 `as` 声明类型；事件参数需写类型，如 `(e: TouchEvent) => {}`。
- 可为 null 的变量使用前要判空或使用 `?.`。
- 数字与数组字面量建议显式类型，避免各端推导不一致。

<!--
Source references:
- docs/uts/README.md
- docs/uts/data-type.md
- docs/tutorial/codegap.md
-->

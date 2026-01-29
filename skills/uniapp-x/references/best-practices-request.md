---
name: best-practices-request
description: uni-app x 中 request 联网与 UTSJSONObject、type 泛型处理接口数据
---

# request 联网

## 问题

JS 中 `res.data.xxx` 可直接访问；UTS 强类型下 `res.data` 为 any，直接 `.` 会报「无该属性」或安全访问问题。

## 方式一：UTSJSONObject

- 将 `res.data` 转为 `UTSJSONObject`，用**下标**或 **keypath** 访问：

```ts
uni.request({
  url: "https://example.com/api",
  success: (res) => {
    const data = res.data as UTSJSONObject
    const list = data["list"] as UTSJSONObject[]
    const name = list[0]["name"]  // 或 data.getString("list[0].name")
  }
})
```

- 适合结构不固定或快速接入；无类型提示，性能略弱于 type 方式。

## 方式二：type + 泛型（推荐）

1. 根据接口数据结构定义 **type**（可用 HBuilderX「JSON 转 type」）。
2. 在 `uni.request` 的泛型中传入该 type，success 中 `res.data` 即具类型：

```ts
type Item = { plugin_name: string }
type Res = { code: number; data: Item[] }

uni.request<Res>({
  url: "https://example.com/api",
  success: (res) => {
    const list = res.data.data  // 类型为 Item[]
    console.log(list[0].plugin_name)
  }
})
```

- 有类型提示与校验，性能更好；接口有约定时优先使用。

## 关键点

- 使用前注意判空：`res.data`、数组下标等。
- 老项目迁移时，可先把接口返回用 UTSJSONObject 接住，再逐步改为 type + 泛型。

<!--
Source references:
- docs/tutorial/request.md
- docs/uts/data-type.md
-->

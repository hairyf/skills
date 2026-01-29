---
name: features-codegap
description: uni-app x 与 JS 开发的差别，强类型与 data/事件类型
---

# 与 JS 开发的差别

## 两大变化

1. **弱类型 JS → 强类型 UTS**：变量、参数、返回值、data、事件参数均需类型。
2. **WebView 渲染 → 原生/ucss**：App 端仅支持 ucss 子集（如 flex、无样式继承）。

## 类型要求示例

- **data**：用字面量推导或 `as`，如 `n4: null as number | null`、`year: date.getFullYear() as number`。
- **事件参数**：必须写类型，如 `touchstart(e: TouchEvent)`、`buttonClick` 若无 event 可省略参数。
- **自定义类型**：用 `type` 定义，在 data 或请求泛型中使用。

## 联网与 JSON

- JS 中 `res.data.xxx` 直接访问；UTS 中 `res.data` 多为 any，需：
  - **UTSJSONObject**：`(res.data as UTSJSONObject)["key"]` 或 keypath `getString("data[0].name")`；
  - **type + 泛型**：定义 type，`uni.request<RespType>({...})`，success 里 `res.data` 即为 `RespType`。

## CSS 差异

- App 端仅 **flex** 与绝对定位；默认 **flex-direction: column**（竖排）。
- **样式不继承**：文字相关样式须写在 `<text>` 上，不能写在父 view 上。
- 选择器仅 **class**，不支持 tag、#id、[attr] 等。

## 关键点

- 从 JS/老版 uni-app 迁移：先确认组件、API、插件在 uni-app x 是否支持；script 改为 UTS 并补类型；样式改为 ucss。
- 渐进迁移：可先把 Web/iOS/小程序迁到 x（只改 CSS），再改 UTS 以兼容 Android。

<!--
Source references:
- docs/tutorial/codegap.md
- docs/readme.md
- docs/css/README.md
-->

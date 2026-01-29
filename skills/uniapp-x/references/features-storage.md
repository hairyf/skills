---
name: features-storage
description: 本地存储 uni.setStorageSync、getStorageSync、key-value 与 UTS 类型注意
---

# 本地存储

## 能力

- **key-value** 本地存储；App 端为原生存储，无大小限制、持久化；H5 为 localStorage；各端实现见官方文档。
- **注意**：key 不要使用 `uni-`、`uni_`、`dcloud-`、`dcloud_` 前缀（系统保留）。

## 同步 API

- **uni.setStorageSync(key, data)**：写入；**对象字面量需 as UTSJSONObject**，例如：
  ```ts
  uni.setStorageSync('obj', { a: 1 } as UTSJSONObject)
  ```
- **uni.getStorageSync(key)**：读取，返回 any，需根据业务 as 成类型。
- **uni.removeStorageSync(key)** / **uni.clearStorageSync()**：删除/清空。

## 异步 API

- **uni.setStorage(options)** / **uni.getStorage(options)**：异步写入/读取，success、fail 回调。

## 注意

- 非 App 平台清空 Storage 可能导致 **uni.getSystemInfo/getDeviceInfo** 获取的 deviceId 变化。
- 若需响应式或复杂状态，可配合 [features-global-state](features-global-state.md) 的 store 模块。

<!--
Source references:
- docs/api/storage.md
-->

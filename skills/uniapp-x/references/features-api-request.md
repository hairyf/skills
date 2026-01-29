---
name: features-api-request
description: uni.request 请求、流式响应、cookie、拦截器、泛型与 Task 释放
---

# uni.request

## 基本用法

- 与 uni-app 一致；**success** 中 `res.data` 在强类型下为 any，需用 **UTSJSONObject** 或 **type 泛型** 处理，见 [best-practices-request](best-practices-request.md)。
- **getLaunchOptionsSync**、**getEnterOptionsSync** 与 onLaunch/onShow 对应，可获取启动/进入时的参数（含 scheme、applink）。

## 流式响应（AI 等）

- 设置响应体为 **arraybuffer**，监听 **onChunkReceived** 流式接收；用 TextDecoder 等解码；注意小程序无 TextDecoder 需用三方库。
- iOS 上 onChunkReceived 依赖服务端 **Transfer-Encoding: chunked** 或 **Content-Type: text/event-stream**。
- 完整 AI 聊天可参考 **uni-ai-x** 插件。

## Cookie 与拦截器

- **request、uploadFile、downloadFile** 等网络 API 间可共享 cookie，见 network-summarize。
- 原生侧无 JS 的动态性，**拦截器**无法完全复刻 JS 行为；建议直接用 uni.request，或使用插件市场已处理泛型等问题的拦截器插件。
- **Android**：request 泛型包装与传递需注意泛型丢失，见 uts-for-android；成熟拦截器插件已处理。

## 注意

- **App 端** request 暂不支持 Promise，返回 **RequestTask**；complete 中建议将 task 置空，避免后续调用已释放的 Task 报错（4.25+ 有自动释放逻辑，仍建议置空）。
- 使用泛型时务必显式写：`uni.request<Person>(options)`；先 `const options: RequestOptions<Person> = ...` 再传时也要写 `uni.request<Person>(options)`。
- **Web** 上 request 目前不能创建传入泛型的实例；4.01 起 Web 返回类型调整为 UTSJSONObject。

<!--
Source references:
- docs/api/request.md
- docs/api/launch.md
- docs/tutorial/request.md
-->

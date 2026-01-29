---
name: core-app
description: App.uvue 应用入口、应用生命周期、globalData、全局样式
---

# App.uvue

## 作用

`App.uvue` 是应用入口主组件，所有页面在其下切换。**没有 `<template>`**，不能写视图，仅用于：

1. 监听**应用生命周期**
2. 配置 **globalData** 全局变量
3. 编写全局可用的 **method**
4. 配置**全局样式**

应用生命周期**仅能在 App.uvue 中监听**，在页面中监听无效。

## 写法

- **仅支持选项式**，暂不支持组合式。

## 应用生命周期

| 生命周期 | 说明 |
|----------|------|
| **onLaunch** | 应用首次启动；可通过 scheme/applink 等获取启动参数。 |
| **onShow** | 应用从后台切到前台；scheme/applink 激活时也会触发，可在此解析并跳转。 |
| **onHide** | 应用切到后台；小程序下打开全屏原生窗体（如 chooseImage）也会触发。 |
| **onExit** | 应用即将退出，见 uni.exit。 |
| **onError** | 脚本报错时触发。 |

## globalData

在 `App.uvue` 的 `globalData` 中定义的数据，可在任意页面通过 `getApp().globalData` 读写。注意：修改后界面不会自动更新，若需响应式可配合专用 store 模块（见 [features-global-state](features-global-state.md)）。

## 注意

- 最早在 **onLaunch** 里做初始化、拉取配置、打开 dialogPage 等；**不要在 main.uts 中**调用 openDialogPage 等依赖页面的 API。

<!--
Source references:
- docs/collocation/app.md
- docs/readme.md
-->

---
name: advanced-native-sdk
description: uni-app x 原生 SDK、混合开发、嵌入原生工程、导出应用原生资源
---

# 原生 SDK 与混合开发

## 用途

- **uni-app x 原生 SDK** 面向 iOS/Android/HarmonyOS 原生开发者，用于**混合开发**：
  1. 渐进式：部分页面用 uni-app x 开发，嵌入既有原生工程。
  2. 使用自己的原生工程做集成与发版。

## 关系

- **原生工程**：开发者现有工程。
- **uni-app x 原生 SDK**：从官方下载的 Android/iOS/Harmony 版 SDK。
- **应用原生资源**：在 HBuilderX 中开发的 uni-app x 项目，通过**发行**或 **HBuilderX CLI** 导出的 kt/swift/ets/js 及图片、字体等资源。

## 流程

1. 在 HBuilderX 中开发 uni-app x 项目。
2. 通过**发行**或 CLI **导出应用原生资源**（kt/swift/ets/js 等）。
3. 在原生工程中**引入 uni-app x 原生 SDK**，并**合并**导出的应用原生资源，整体编译运行。

## 特点

- uni-app x 提供**完整应用**（页面管理、组件、API），不仅是一个 view；集成后类似集成小程序 SDK。
- **uts 编译为原生语言**，与原生工程可**无缝互操作**，甚至整体断点 Debug；无跨语言桥接。
- 支持**原生混编联调**：将原生工程与 uni-app x 工程一起在 HBuilderX 中联编，uts 与 kotlin/swift/ets 混编。

## 集成文档

- [集成 Android 原生 SDK](https://doc.dcloud.net.cn/uni-app-x/native/use/android.html)
- [集成 iOS 原生 SDK](https://doc.dcloud.net.cn/uni-app-x/native/use/ios.html)
- [集成鸿蒙原生 SDK](https://doc.dcloud.net.cn/uni-app-x/native/use/harmony.html)

## 关键点

- 集成后包体积会增加（约 8MB 级，见官方说明）；支持多 CPU 架构时按架构增加。
- 导出资源与 SDK 版本需匹配；升级 HBuilderX/编译器后建议重新导出并更新原生工程依赖。

<!--
Source references:
- docs/native/README.md
- docs/project.md
-->

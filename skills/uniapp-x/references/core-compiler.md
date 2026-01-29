---
name: core-compiler
description: 编译器、条件编译、静态资源 static、编译缓存
---

# 编译器与静态资源

## 编译器组成

- **uts 编译器** + **uvue 编译器**；uts 会调用各平台编译器（Kotlin、Swift 等）。
- uvue 基于 **Vite** 扩展；条件编译、环境变量等与 uni-app vue3 编译器一致；支持 less、sass、scss 等 CSS 预编译。

## 条件编译

- 与 uni-app 相同，见 [uts-conditional](uts-conditional.md)；uni-app x 新增 **APP-ANDROID**、**APP-IOS** 等条件。
- 用于在 template、script、style 中按平台或项目类型编译不同代码。

## 静态资源

- **图片、字体、音视频**：放在项目根目录 **/static**（或 uni_modules 的 /static）；编译器会扫描并复制到产物。
- **web-view 本地 html**：放在 **/hybrid**。
- **不要**把参与编译的源码（如 .uts、.css）放在 static；static 内文件不会参与编译，仅复制。
- 页面中通过**非变量路径**或 import 引用的静态资源会被识别；变量路径在某些场景可能需额外配置，见官方「静态资源」章节。

## 编译缓存

- 编译结果缓存在 **unpackage** 下；未改动的文件下次运行会复用缓存，加快编译。
- 修改代码后若未生效，可在运行窗口勾选 **清理构建缓存** 再运行。
- 升级 HBuilderX 或编译器后会重新编译；安全软件扫描 unpackage 可能拖慢速度，可将该目录设为信任。

## 关键点

- 静态资源统一放 **static**；非静态不放 static。
- Android 编译会产生大量 kt、class 等临时文件，建议 unpackage 加入信任/排除扫描。

<!--
Source references:
- docs/compiler/README.md
- docs/project.md
-->

---
name: uts-conditional
description: UTS 条件编译、平台判断、#ifdef APP-ANDROID、#ifndef
---

# 条件编译

## 作用

- 同一份代码在不同**平台**、**项目类型**下编译出不同结果；用于调用平台特有 API、或仅在某端存在的逻辑。
- 与 uni-app 条件编译一致，详见 [uni-app 条件编译](https://uniapp.dcloud.net.cn/tutorial/platform.html)。uni-app x 中新增 **APP-ANDROID**、**APP-IOS** 等。

## 常见写法

```ts
// #ifdef APP-ANDROID
import Build from 'android.os.Build'
console.log(Build.MODEL)
// #endif

// #ifdef APP-IOS
// iOS 专用
// #endif

// #ifndef H5
// 非 H5 时编译
// #endif
```

- **#ifdef**：当某条件成立时编译其后代码；**#ifndef**：当某条件不成立时编译。
- 可用于 template、style、script；块内代码需符合目标平台语法（如 Android 块内可写 UTS 调 Kotlin API）。

## 常见条件

- **APP-ANDROID**、**APP-IOS**、**APP-HARMONY**、**H5**、**MP-WEIXIN** 等平台；
- **UNI-APP-X**：区分是否为 uni-app x 项目；
- 更多预定义见官方「条件编译」文档。

## 关键点

- UTS 中平台专有类型（如 Kotlin 的 Int、Swift 的 NSString）需放在条件编译内，否则其他平台报错。
- 插件作者常用条件编译为不同平台提供不同实现、统一接口。

<!--
Source references:
- docs/uts/README.md
- docs/compiler/README.md
- https://uniapp.dcloud.net.cn/tutorial/platform.html
-->

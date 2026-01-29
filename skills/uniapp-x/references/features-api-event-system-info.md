---
name: features-api-event-system-info
description: 事件总线 uni.$on/$emit、启动参数 getLaunchOptionsSync、系统信息 getSystemInfo
---

# 事件总线与系统信息

## 事件总线（uni.$on / uni.$emit）

- **uni.$emit(eventName, args?)**：发送事件；**uni.$on(eventName, callback)**：监听；**uni.$off** 取消监听；**uni.$once** 仅监听一次。
- 用于页面间、窗体间（如 leftWindow 与 main）、dialogPage 与主页面等解耦通信；注意及时 $off 避免泄漏。

## 启动与进入参数

- **uni.getLaunchOptionsSync()**：获取本次启动时的参数（相当于 onLaunch 时的入参）；scheme/applink 需在 AndroidManifest/Info.plist 配置，打包后生效。
- **uni.getEnterOptionsSync()**：获取本次进入前台时的参数（相当于 onShow）；做“直达页”时一般在 **App.onShow** 里解析并 navigateTo。

## 系统信息（uni.getSystemInfo / getSystemInfoSync）

- 返回 device、os、rom、host、uni、app 等层级信息；涉及字段多，后续拆出 **getDeviceInfo**、**getAppBaseInfo**、**getWindowInfo**，建议新代码用这三个 API。
- **appTheme**：应用主题；值为 `auto` 时表示跟随系统，需查 **osTheme** 得知当前 light/dark。
- **windowHeight**：Android 上依赖调用时机，全局作用域可能尚未包含导航栏/TabBar 高度，建议在 **onReady** 或 **onPageShow** 内获取；且依赖栈顶页面，延迟获取可能已是新页面高度。
- 4.25 起 Android 安全区域 top 调整为状态栏高度；获取 OAID、AndroidID 等见插件市场。

## 关键点

- 事件名建议常量或枚举，避免拼写错误；$on 在页面/组件销毁时 $off。
- 主题与窗口信息以 onReady/onPageShow 或主题变更回调中获取为准，避免首帧或页面切换导致的数值不准。

<!--
Source references:
- docs/api/event-bus.md
- docs/api/launch.md
- docs/api/get-system-info.md
- docs/collocation/app.md
-->

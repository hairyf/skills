---
name: features-api-overview
description: uni-app x API 概述、uni API、全局 API、原生 API 调用
---

# API 概述

## 可用 API 来源

1. **UTS 内置对象**：如 [global](https://doc.dcloud.net.cn/uni-app-x/uts/buildin-object-api/global.html)、Array、Date、Promise 等；以及平台专有 UTSAndroid、UTSiOS。
2. **全局 API**：不需加 `uni.`，如 `getApp()`、`getCurrentPages()`。
3. **uni.xxx**：数量最多，如 uni.request、uni.navigateTo、uni.showModal 等；[详见 API 文档](https://doc.dcloud.net.cn/uni-app-x/api/)。
4. **uniCloud.xxx**：云开发相关。
5. **DOM API**：见官方「dom」文档。
6. **Vue API**：ref、computed、watch、onLoad 等，无需 import。
7. **平台原生 API**：Android/iOS/鸿蒙/浏览器/小程序各自的原生 API，可直接在 UTS 中调用。

## 调用原生 API 示例（Android）

```ts
import Build from 'android.os.Build'
export default {
  onLoad() {
    console.log(Build.MODEL)                      // 原生 API，手机型号
    console.log(uni.getSystemInfoSync().deviceModel) // uni API，同上
  }
}
```

- **import**：`import 名字 from '平台包名'`，如 `import Build from 'android.os.Build'`。
- 正规开发建议将原生能力封装为 **uts 插件**（uni_modules），便于跨平台与共享；iOS 的 js 驱动模式下 uvue 中不能直接调 Swift，需通过 uts 插件。

## Promise 与 生命周期

- 部分 uni 异步 API 支持 Promise，文档返回值中会注明。
- 应用/页面/组件生命周期见 [core-lifecycle](core-lifecycle.md) 与官方「生命周期」章节。

## 关键点

- 跨平台能力优先用 **uni.xxx**；需要平台特性时再调原生 API 或使用 uts 插件。
- uni 的很多 API 本身由 uts 实现并开源在 uni-api；可查阅实现或自行替换 uni_modules 中的实现。
- 老版 plus、weex API 在 uni-app x 中已不支持，替代方案见官方「ext」文档。

<!--
Source references:
- docs/api/README.md
- docs/readme.md
-->

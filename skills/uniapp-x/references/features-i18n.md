---
name: features-i18n
description: 国际化、多语言、动态切换、lime-i18n、vue-i18n(Web)、uni.getLocale
---

# 国际化

## 两种需求

1. **固定一种外语**：直接在代码里写该语言即可。
2. **动态切换语言**：内置多语言，根据设置或系统切换；需区分「开发者代码」与「框架代码」的国际化。

## 开发者代码国际化

- **App**：vue-i18n 尚未适配 UTS；推荐用插件 **[lime-i18n](https://ext.dcloud.net.cn/plugin?id=18954)** 做动态切换。
- **Web**：可用 **vue-i18n**；在 main.uts 中 `createI18n`、`app.use(i18n)`，注意用条件编译避免 App 报错；语言包用 json，模板中 `$t('key')`、脚本中 `this.$t('key')`。
- 当前语言：**uni.getLocale()**；设置语言后界面需根据 locale 更新（如切换 i18n 的 locale 或自有 store）。

## 框架部分国际化

- uni-app x 内置组件与 API 的文案会随系统/应用语言变化；部分需在 manifest 或各端配置中声明支持的语言。

## 关键点

- 动态切换时需把“当前语言”存到全局（如 storage 或 store），并让所有依赖语言的 UI 响应该状态。
- Web 下若用 SSR，i18n 需用 createSSRApp 与 createI18n 的 SSR 用法，见官方 i18n 文档。

<!--
Source references:
- docs/i18n.md
-->

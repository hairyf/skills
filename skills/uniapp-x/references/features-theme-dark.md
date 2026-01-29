---
name: features-theme-dark
description: 主题与暗黑模式、theme.json、setAppTheme、onAppThemeChange、pages.json 样式
---

# 主题与暗黑模式

## 三种主题概念

| 概念 | 说明 | App | Web/小程序 |
|------|------|-----|------------|
| **osTheme** | 系统主题 | 可获取；getDeviceInfo | 无 |
| **hostTheme** | 浏览器/小程序宿主主题 | 无 | 可获取；getAppBaseInfo |
| **appTheme** | 应用自身主题 | 可获取、设置、监听 | - |

- App：**uni.getAppBaseInfo()** 取 appTheme；**uni.setAppTheme()** 设置；**uni.onAppThemeChange** 监听。
- **uni.setAppTheme** 会按 **theme.json** 更新 pages.json 的亮/暗样式，并触发 onAppThemeChange；开发者与插件在回调中更新自己的 UI（如切换 class、响应式变量）。

## theme.json（HBuilderX 4.18+）

- 在项目根目录建 **theme.json**，定义 **light** / **dark** 下的变量（如 navBgColor、navTxtStyle）。
- 在 **pages.json** 的样式里用 **@变量名** 引用；新页面创建时即按主题应用，避免转场闪白/闪黑。
- **theme.json 只负责 pages.json 的页面样式、tabBar 样式**，不负责开发者页面内 CSS；页面内样式需自行根据 appTheme/osTheme 切换（如 class 绑定、getAppBaseInfo 后存响应式变量）。

## 适配范围

- 开发者 uvue：多数用 CSS + 动态 class；App 不支持媒体查询，需用 **getAppBaseInfo** 取主题后存响应式变量，模板绑定 class。
- 框架自带 UI：showModal、showActionSheet 等部分已适配暗黑；manifest 中 web/mp-weixin 可配 **darkmode: true**。
- 示例：hello uni-app x 在 App.uvue onLaunch 中 checkSystemTheme，存 state.isDarkMode，组件内用 computed 绑定 class。

## 关键点

- appTheme 为 `auto` 时表示跟随系统，需查 **osTheme** 得知当前是 light 还是 dark。
- 默认主题可在 **manifest.json -> app -> defaultAppTheme** 中配置。

<!--
Source references:
- docs/collocation/themejson.md
- docs/api/theme-change.md
- docs/readme.md
-->

---
name: features-web
description: 编译到 Web、与 App 差异、SPA、refs 与类型、SSR 简述
---

# 编译到 Web

## 与 App 的差异

- **Web 为 SPA**，App 为多页；pages.json 的导航栏和 tabBar 在 Web 上是页面的一部分，可操作 DOM。
- **Web 默认有页面滚动**，App 无；App 需用 scroll-view 等实现滚动。
- 编译基于 **uts 统一规范**，与编译到 Android 的一致性较高；Vue 特性支持有部分差异，见官方「编译到 web 端」文档。

## Web 端注意

- 较早版本创建的项目（根目录为 app.vue 而非 app.uvue）运行 Web 可能失败，需替换 **index.html** 和 **App.uvue**（可从新项目或 hello uni-app x 复制）。
- **refs** 获取内置组件时得到的是 **UniXxxElement**，非 Vue 组件实例；与 App 一致。
- **$data、$refs** 等：为跨端一致，建议统一用**下标访问**（如 this.$data['a']），避免 Web 与 App 类型差异。
- 组件使用 **emits** 时，this 传给 **ComponentPublicInstance** 类型需 **as** 一下，见官方文档。

## 暂不支持 / 部分支持

- 暂不支持：v-once、v-memo、render 函数；组件内监听 **onPageScroll、onReachBottom**。
- 部分支持：mixin 需用 **defineMixin**，不可用对象字面量。
- 4.11+ 支持：defineOptions、defineModel、toValue、toRef、toRefs、hasInjectionContext 等。

## SSR（HBuilderX 4.18+）

- 可将同一应用在服务端渲染为 HTML，再在客户端“激活”；需配置 **vite.config.js** 的 base 等，并编写 **serverPrefetch**、**ssrRef** 等 SSR 相关逻辑。
- 部署：server 部分部署到云函数或自建服务器，client 静态资源部署到 CDN 或 uniCloud 前端网页托管；详见 docs/web/ssr.md。

## 关键点

- 跨端时注意“页面滚动”与“scroll-view 滚动”的差异；Web 有页面滚动，onPageScroll 等依赖根节点为 scroll-view 的逻辑在 Web 上可能不同。
- 样式：Web 支持完整 CSS；编译时会做重置以与 ucss 行为一致，见 css 文档。

<!--
Source references:
- docs/web/README.md
- docs/web/ssr.md
- docs/adapt.md
-->

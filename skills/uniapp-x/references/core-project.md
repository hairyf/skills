---
name: core-project
description: uni-app x 项目结构、新建、运行与发行
---

# uni-app x 项目

## 新建项目

- 在 HBuilderX 中：**文件 > 新建 > 项目**，选择「新建 uni-app 项目」。
- 底部**必须勾选「uni-app x」**，否则会建成为老版 uni-app 项目。
- 可选空项目或「hello uni-app x」示例；uni-app x 仅支持 Vue3。

项目标识：`manifest.json` 中需有 `"uni-app-x": {}`；左侧项目管理器图标为圆形 U。

## 项目结构要点

```
├── pages/               # 页面，每页 .uvue
│   └── index/index.uvue
├── components/          # 符合 vue 规范的组件
├── static/              # 静态资源（图片、字体等）
├── uni_modules/         # uni_module 插件
├── unpackage/           # 编译产物，建议 git 忽略
├── App.uvue             # 应用配置与全局样式
├── main.uts             # Vue 初始化入口
├── pages.json           # 页面路由、导航栏、tabBar 等
├── manifest.json        # 应用名、appid、版本等
└── uni.scss             # 内置样式变量
```

- 无 `nativeplugins`，仅支持 uts 插件（可与老版 uni-app 共用）。
- 使用 Cursor 等 AI 开发时，可在项目下放 `.cursor` 目录以辅助生成 uni-app x 代码。

## 运行

- 菜单/工具栏「运行」或快捷键 `Ctrl+R`，选择目标平台。
- **App**：标准基座（绿色圆形 U）用于真机/模拟器运行与热刷；自定义基座需先云打包，再在运行界面选择。
- **Web**：基于 Vite 按需编译，先出首页，其余页面后台编译；若有报错会在控制台输出。

## 发行

- 菜单「发行」或 `Ctrl+U`，选择目标平台。
- Android/iOS 支持云打包；也可通过 HBuilderX CLI 做持续集成。
- 若需发布为「其他应用的一部分」：App 端参考「uni-app x 原生 SDK」出 kt/swift 源码集成；小程序可出分包。

## 关键点

- 页面后缀为 `.uvue`，且需在 `pages.json` 中注册。
- 逻辑层使用 UTS，非 JS（Android 无 JS 引擎）。
- 使用 uvue 渲染（Vue 语法 + ucss），App 端为原生渲染。

<!--
Source references:
- https://gitcode.com/dcloud/unidocs-uni-app-x-zh
- docs/project.md
-->

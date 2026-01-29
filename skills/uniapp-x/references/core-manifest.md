---
name: core-manifest
description: manifest.json 应用配置、appid、版本、图标、uni-app-x 标识
---

# manifest.json

## 作用

`manifest.json` 用于配置应用名称、版本、图标、appid 等打包与运行信息，位于项目根目录。

## 关键项

- **uni-app-x**：必须存在该节点，是项目被识别为 uni-app x 的依据（圆形 U 图标）；缺少则被识别为老版 uni-app。
- **appid**：由 DCloud 分配，用于云服务，勿随意修改。
- **versionName / versionCode**：应用版本号，用于商店与升级。
- **App 配置**：图标、启动图（splash）、隐私政策等；uni-app x 无内置隐私弹框配置，需自行在 onLaunch 中弹框（如用 dialogPage），在用户同意前不采集隐私数据。

## 其他

- 默认无 splash 启动页，可自建 uvue 页面做 splash；HBuilderX 3.99+ 支持配置 splash，见 manifest-splashscreen。
- 内置模块采用**摇树**自动选择，见 manifest-modules。

## 关键点

- App 端图标等建议在 HBuilderX 的 manifest 可视化界面中操作，避免手改源码出错。
- 隐私政策示例见 hello uni-app x 中 App.uvue 的 `uni.getPrivacySetting` 与 dialogPage 弹框。

<!--
Source references:
- docs/collocation/manifest.md
- docs/readme.md
-->

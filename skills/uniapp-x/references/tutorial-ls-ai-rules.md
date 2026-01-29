---
name: tutorial-ls-ai-rules
description: 语言服务插件、Cursor/VSCode、AI Rules、MCP、AI 修复
---

# 语言服务与 AI 规则

## 语言服务插件（ls-plugin）

- **uni-app x 语言服务** 插件适用于 **Cursor / VSCode** 等兼容 VSCode 的 IDE；提供 .uvue/.uts 的**高亮、提示、校验、格式化、跳转定义**。
- 仅支持 **uni-app x** 项目；**不支持运行、Debug、发行**，运行仍需在 **HBuilderX** 中。
- 安装：在 VSCode/Cursor 插件市场搜索「uni-app x 语言服务」（圆形绿色 U、DCloud），安装后需重启编辑器。
- **平台设置**：状态栏可选择当前语言服务目标平台（默认 APP-ANDROID）；多平台会加载多套语言服务，影响性能，单平台开发建议只选一个；与条件编译配合，非选中平台的条件编译块可置灰。

## AI Rules 与 MCP

- **AI Rules**：将 UTS、ucss 与 TS/CSS 的差异写成规则，让 AI 生成更符合 uni-app x 的代码。
- **Cursor**：复制 [uni-app-x-ai-rules](https://gitcode.com/dcloud/uni-app-x-ai-rules) 中的 **.cursor** 到项目根目录。
- **VSCode Copilot**：复制 **.github** 到项目根目录；**Trae** 复制 **.trae**；**Claude Code** 复制 **.claude** 和 **.mcp.json**；**Antigravity** 复制 **.agent**。
- **MCP**：安装 **@dcloudio/uni-app-x-mcp**，在项目根目录配置 **.cursor/mcp.json** 或 **.vscode/mcp.json**，可向 AI 提供当前项目的 **easycom 组件清单**，便于生成代码时使用已有组件。

## AI 修复（HBuilderX 4.71+）

- 编译到 **Android/iOS** 出现编译错误时，控制台会提供可点击的 **AI 修复** 链接；点击后在右侧查看建议与 diff，可选择同意/拒绝替换。
- 多文件错误时可逐个修复；4.72+ 支持单区域同意/拒绝、取消修复、清空回复等。
- 若不用 HBuilderX 的 AI 修复，可选中控制台日志右键「生成 AI 提示词」，将带 uni-app x 上下文的 prompt 粘贴到 Cursor 等工具中自行修复。

## 关键点

- 使用 Cursor/VSCode 开发时，运行与调试仍需打开 HBuilderX；语言服务插件只提供编辑期能力。
- 项目根目录放置 **.cursor**（或对应 IDE 的规则目录）和 **mcp 配置**，可显著提升 AI 生成与修复的准确度。

<!--
Source references:
- docs/tutorial/ls-plugin.md
- docs/tutorial/rules_mcp.md
- docs/tutorial/bug_repair.md
-->

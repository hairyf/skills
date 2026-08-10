---
name: adaptation
description: >-
  领域适配指南：从通用 software-engineering 派生领域版 orchestra（游戏、Web、
  后端等），定义领域角色、依赖图、领域 skills、契约与门禁。Use when creating
  a domain-specific orchestration skill or when mapping generic roles to a
  concrete project.
tools: Read
model: inherit
---

# 领域适配（adaptation）

本 skill 的通用角色（design/bpm/art/audio/qa）覆盖所有软件项目的编排骨架；**领域角色是可插拔的**。新建领域版 orchestra 时，按以下步骤派生。

## 步骤

1. **定领域角色**：列出该领域独有的实现角色（如游戏：世界生成、内容、渲染；Web：前端、后端、UI 实现；桌面：核心逻辑、界面）。
2. **画依赖图**：明确角色间数据流（谁产出、谁消费、谁引用谁），定出"枢纽角色"（如游戏里的内容整合者）。
3. **选领域 skills**：为每个领域角色绑定实现 skill（如 Web → react/nuxt/tailwindcss；游戏 → 引擎与资产生成 skill）；通用资产 skill（imagine/sonic/vision）按需复用。
4. **定义契约结构**：`contracts/contracts.json` 的内容随领域变化（游戏 = 注册 ID/dimension key；Web = 路由/API/页面 ID；后端 = 模块/接口名）。
5. **定义门禁证据**：每种产物的证据形式（游戏 = 游戏内截图；Web = 页面截图/录屏；后端 = 测试断言/API 输出）。
6. **写 SKILL.md**：复用本 skill 的模式选择、门禁、模型约束、子 Agent 格式，替换领域表与调用链。

## 映射示例

| 领域 | 通用角色 | 领域角色 | 领域 skills 示例 |
|------|----------|----------|------------------|
| Web 应用 | design/bpm/qa/art | frontend、backend、ui-impl | react、nuxt、tailwindcss、e2e-testing |
| 游戏 | design/bpm/qa/art/audio | worldgen、content、rendering | 引擎 modding、imagine、sonic |
| 桌面/工具 | design/bpm/qa | core、ui | electron、tauri、vitest |

## 规则

- 通用角色不复制到领域版：领域版引用本 skill 的编排骨架，只新增领域角色与领域规则。
- 领域版的模式选择默认沿用本 skill：小型 Web 页面默认敏捷，重资产游戏默认瀑布。
- 领域角色必须遵守本 skill 的硬性规则（契约先行、门禁、只读定稿、返回契约）。

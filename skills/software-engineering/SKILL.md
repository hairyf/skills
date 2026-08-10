---
name: software-engineering
description: >-
  Orchestrate a multi-agent software project (web app/page, tool, game,
  library, etc.) with a team of specialized subagents — design, bpm, art,
  audio, qa — in agile or waterfall mode, using iteration/wave scheduling,
  shared contracts, and user review gates. Use when planning or running
  multi-agent software development. Domain roles (frontend, backend, engine,
  worldgen, etc.) are pluggable and chosen per project; generic asset skills
  like imagine, sonic, and vision are optional companions.
metadata:
  author: Hairy
  version: "2026.8.10"
  source: Hand-written from the minecraft-orchestra workflow, generalized to any software project, scripts located at https://github.com/hairyf/skills
---

# Software Engineering（多 Agent 软件工程编排）

> 通用编排 skill：把复杂的软件项目拆给一组专业子 Agent（design、bpm、art、audio、qa + 按项目选择的领域角色），以**敏捷**或**瀑布**模式调度，用共享契约和用户审查门禁保证质量。适用于 Web 页面/应用、桌面/移动工具、游戏、库等任何软件项目。

## Mode Selection — 先选模式，再开工

开工第一件事是选模式，避免"只想快速做个软件，却等了完整设计流程"。

| 判断 | 敏捷 (Agile) | 瀑布 (Waterfall) |
|------|--------------|------------------|
| 需求 | 模糊、可边做边验证 | 明确或需要穷尽 |
| 规模 | 中小型 / MVP / 原型 / 单页 / 工具 | 大型、多模块、多 Agent 并行 |
| 时间 | 用户想尽快看到可运行成果 | 用户接受前期设计成本 |
| 资产管线 | 少或无 | 重（美术/音频/数据） |
| 交付 | 每个迭代可演示 | 分阶段整体交付 |

- **默认走敏捷**：用户没有明确要求完整方案、或请求是中小型软件时，先交付可运行的 MVP 再迭代，每个 slice 必须能演示。
- **选瀑布**：需求复杂、多模块强耦合、重资产管线（如游戏、企业系统），或用户明确要求完整设计先行时，才进入瀑布模式。
- 敏捷迭代中若出现契约冲突激增、并行需求膨胀，bpm 可升级为瀑布模式（记录切换原因）。

两种模式的完整工作流与门禁差异见 [modes](references/modes.md)。

## When to Use

- 规划或执行一个多 Agent 软件项目（Web 页面/应用、工具、游戏、库等）
- 需要分波/分迭代调度，或需要"用户审查门禁"保证主观产物符合预期
- 单个 Agent 能轻松完成的小改动，不需要本 skill

## Core References

| Agent/概念 | Responsibility | Reference |
|------------|----------------|-----------|
| modes | 敏捷/瀑布两种模式的完整工作流、选择标准与门禁差异 | [modes](references/modes.md) |
| design | 需求澄清与规格：敏捷 = 一页轻量 spec；瀑布 = 完整设计文档（需求/数据/UX/清单/数值/验收标准） | [design](references/design.md) |
| bpm | 编排者：模式选择、任务拆分、迭代/波次调度、契约维护、门禁放行、冲突仲裁 | [bpm](references/bpm.md) |
| art | 视觉资产：概念图、UI mockup、模型、贴图（必须多模态模型） | [art](references/art.md) |
| audio | 音频：BGM、环境音、音效、UI 音 + audio-manifest | [audio](references/audio.md) |
| qa | 验证：单测/集成/E2E、截图断言、CI 回归；只验证不实现 | [qa](references/qa.md) |
| adaptation | 领域适配：如何从本 skill 派生领域版 orchestra（游戏/Web/后端） | [adaptation](references/adaptation.md) |

## Orchestration Workflow

1. **选模式**（bpm）：按上表判断敏捷/瀑布，向用户确认预期（30 秒内决定，默认敏捷）。
2. **契约先行**（瀑布必做，敏捷按需）：锁版本矩阵（框架/引擎/依赖），维护 `contracts/contracts.json`（共享 ID、resource location、命名规则）；任何 Agent 不得私自新增。
3. **规格/设计**（design）：敏捷 = 一页 spec；瀑布 = 完整设计文档。经用户确认后才进入开发。
4. **调度**：
   - 敏捷：把需求切成垂直 slice，每个 slice 实现 → 验证 → 演示 → 确认，循环推进；slice 足够小，一次会话可完成演示。
   - 瀑布：分波次并行（Wave 1 骨架/最高风险项，Wave 2 量产角色，Wave 3 集成 + QA），并发上限 ≤3 个子 Agent。
5. **门禁**：每个用户审查点显式呈现证据（图片/音频用绝对路径 Markdown），未获确认不放行。
6. **集成交付**：全量构建 + 自动化测试 + 交付摘要。

## User Review Gates

| 阶段 | 证据形式 |
|------|----------|
| 规格/设计 | 文字评审 |
| 视觉产物 | 图片 + 用户确认 |
| 音频产物 | 播放 + 用户确认 |
| 功能/交互 | 演示（截图/录屏/可运行构建）+ 用户确认 |
| 测试 | 断言结论 + 截图 + 用户确认 |

## Model Constraint

- art 及任何"看图决策"角色必须运行在支持图像输入的多模态模型上；若无视觉能力，立即停止并回报，禁止用文字描述代替直接看图。

## Subagent File Format（规范速查）

- **Claude Code**：Markdown + YAML frontmatter；必填 `name` / `description`，可选 `tools` / `disallowedTools` / `model` / `skills` / `maxTurns` / `mcpServers` / `permissionMode`；正文即系统提示词；存放 `.claude/agents/` 或 `~/.claude/agents/`。
- **Codex**：`.codex/agents/*.toml`，必填 `name` / `description` / `developer_instructions`；OpenAI 官方提供 `.md → .toml` 迁移脚本（openai/skills 仓库）。

## Related Skills

- [imagine](../imagine/SKILL.md) — 图像/贴图生成（art 的配套）
- [sonic](../sonic/SKILL.md) — 音乐/音效生成（audio 的配套）
- [vision](../vision/SKILL.md) — 非多模态模型下看图兜底（可选）
- 领域 skills（react、nuxt、flutter、fabric 等）由 [adaptation](references/adaptation.md) 流程按项目选择，不内置在本 skill。

---
name: features-dom
description: UVUE DOM、UniElement、getElementById、ref、样式与 draw API
---

# UVUE DOM

## 概念

- 每个 uvue 页面在内存中有 **DOM**，与浏览器 DOM 类似；节点对应 **UniElement**（HBuilderX 4.0 起统一为该类型）。
- 为减少与 Vue 的冲突，**不支持**通过 DOM API **创建/删除**节点，仅支持**获取**元素并操作其属性/样式或调用方法。

## 使用场景

1. **跟手动效**：在 touch、scroll 中需 16ms 一帧时，用 **ref 或 getElementById** 拿到 UniElement，直接调 DOM API 改样式（如 transform），跳过 Vue 的 diff。
2. **Draw API**：Android/iOS 的底层绘制能力需先拿到 UniElement，再调用其上的 draw 相关方法；示例见日历等模板。

## 获取元素

- **uni.getElementById(id)**：仅能获取**栈顶主页面**内带 id 的元素；dialogPage 内或非栈顶页需用 **this.$page.getElementById(id)** 或 **getCurrentInstance()?.proxy?.$page.getElementById(id)**。
- **ref**：模板写 `ref="xxx"`，script 中声明对应类型（UniElement、UniXxxElement、ComponentPublicInstance），通过 xxx.value 或 this.$refs.xxx 访问。
- 建议在 **onReady** 之后使用，确保节点已创建。

## 可进行的操作

- 读写样式、部分属性；调用组件或元素上的方法（如 video 的 play）；draw API 等；详见 [UniElement](https://doc.dcloud.net.cn/uni-app-x/api/dom/unielement.html) 与各组件文档。
- 不要通过 DOM 增删节点，以免与 Vue 管理的树不一致。

## 关键点

- 跟手、高频更新场景优先 **transform + DOM API**；普通数据驱动仍用 Vue 绑定。
- 跨页面操作元素时注意“当前页”是主页面还是 dialogPage，选用 uni.getElementById 或 $page.getElementById。

<!--
Source references:
- docs/api/dom/README.md
- docs/performance.md
- docs/tutorial/idref.md
-->

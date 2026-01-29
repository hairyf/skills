---
name: features-vue-directives
description: uvue 内置指令 v-if、v-for、v-show、v-model、v-bind、v-text、v-html
---

# Vue 内置指令

## 常用指令

| 指令 | 说明 |
|------|------|
| **v-if** | 条件渲染；为假时元素不渲染；可与 v-else、v-else-if 配合。 |
| **v-show** | 切换 display 可见性，元素始终存在。 |
| **v-for** | 列表渲染；需写 **key**（建议唯一 id）；可遍历数组、数字范围等。 |
| **v-model** | 双向绑定，用于 input、textarea、组件等。 |
| **v-bind** / **:prop** | 动态绑定属性；如 `:style="obj"`、`:class="cls"`。 |
| **v-on** / **@event** | 绑定事件；如 `@click="fn"`。 |
| **v-text** | 设置元素文本，覆盖原有内容。 |
| **v-html** | 设置 HTML；App-android 上通过 rich-text 实现，需符合 rich-text 标签与嵌套规则，且不支持 class 样式。 |

## 注意

- **v-for** 与 **v-if** 同时用时，v-for 优先级更高；若需“先筛再循环”，可在计算属性中先过滤再 v-for。
- **v-html** 在 Android 上有限制，富文本复杂时建议用 **rich-text** 组件并传 nodes。
- 列表项务必提供稳定 **key**，避免用 index 导致复用错乱（尤其在 list-view 中）。

<!--
Source references:
- docs/vue/built-in.md
- docs/component/rich-text.md
-->

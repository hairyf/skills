---
name: vue-data-bind-modifier
description: 数据绑定、响应式状态、事件修饰符、v-model 修饰符
---

# 数据绑定与修饰符

## 响应式状态

- **选项式**：data() 返回对象；computed、methods、watch 等。
- **组合式**：ref、reactive 声明状态；computed、watch；**defineExpose** 暴露给父组件。
- 模板中可绑定表达式、调用方法；样式里可用 **v-bind()**（部分平台/版本支持）绑定 script 中的变量。

## 事件修饰符

- **.stop**、**.prevent**、**.capture**、**.self**、**.once**、**.passive**：与 Vue 一致，见 modifier 文档。
- **按键**：.enter、.tab、.delete、.esc、.space、.up、.down、.left、.right。
- **系统键**：.ctrl、.alt、.shift、.meta、.exact。
- **鼠标键**：.left、.right、.middle。

## v-model 修饰符

- **.lazy**：失焦后同步而非 input 时。
- **.number**：将输入转为数字。
- **.trim**：首尾空格去除。

## props 与 sync

- **.sync** 等与 Vue 3 一致；组件上 v-model 对应 modelValue/update:modelValue 或自定义 prop 与事件。

## 关键点

- 表单类组件用 v-model 时注意 .number、.trim；事件需要阻止默认或冒泡时用 .prevent、.stop。

<!--
Source references:
- docs/vue/data-bind.md
- docs/vue/modifier.md
- docs/vue/built-in.md
-->

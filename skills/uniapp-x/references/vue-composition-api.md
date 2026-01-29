---
name: vue-composition-api
description: 组合式 API ref、computed、watch、reactive、readonly、watchEffect
---

# 组合式 API

## 注意

- 暂不支持 `<script setup>` 与 `<script>` 同时存在；需配置 options（如 name）时用 **defineOptions**。
- 暂不支持顶层 **await**、**generic** 泛型参数。
- **App.uvue** 从 HBuilderX 5.0 起支持组合式，此前仅选项式。

## 响应式核心

- **ref(initialValue)**：返回带 `.value` 的响应式引用；模板中自动解包，script 中需 .value。
- **reactive(obj)**：返回对象的深层响应式代理；**App-Android 上暂不支持对 class 做 reactive**，推荐用 **type** 定义数据对象。
- **computed(getter)**：只读计算属性；需**泛型指定返回类型**，如 `computed<number>(() => count.value * 2)`；可写时传 `{ get, set }`。
- **watch(source, callback, options)**：侦听一个或多个响应式源，变化时执行回调。
- **watchEffect** / **watchPostEffect** / **watchSyncEffect**：立即执行一次并收集依赖，依赖变化时再执行。
- **readonly**：包装为只读代理；**shallowReactive**、**shallowRef** 等见官方文档。

## 工具

- **isRef**、**unref**、**toRef**、**toValue** 等；与 Vue 3 用法一致，详见官方 composition-api 文档。

## 关键点

- 组合式中 **computed** 必须写泛型返回类型；reactive 在 Android 上用 type 定义的结构而非 class。
- 所有 Vue/uni 的 API（ref、onLoad 等）无需 import，由框架注入。

<!--
Source references:
- docs/vue/composition-api.md
- docs/vue/README.md
-->

---
name: features-global-state
description: 全局变量与状态管理、globalData、专用 store 模块（reactive）
---

# 全局变量与状态管理

## 现状

- App 端**暂不支持 pinia、vuex**；可用 **globalData** 或**专用 store 模块**做全局状态。

## globalData

- 在 **App.uvue** 的 `globalData` 中定义，各页面通过 **getApp().globalData** 读写。
- 修改后界面**不会自动更新**；仅适合作简单全局变量。

## 专用 store 模块（推荐）

- 新建 uts 文件（如 `/store/index.uts`），用 **reactive** 定义状态并导出，再导出修改方法；页面中 **import** 后使用，并用 **computed** 绑定到模板即可响应式更新。

示例：

```ts
// store/index.uts
export type State = { globalNum: number }
export const state = reactive({ globalNum: 0 } as State)
export const setGlobalNum = (num: number) => { state.globalNum = num }
```

```vue
<!-- 页面 -->
<script>
import { state, setGlobalNum } from '@/store/index.uts'
export default {
  computed: {
    globalNum(): number { return state.globalNum }
  },
  methods: {
    plus() { setGlobalNum(state.globalNum + 1) }
  }
}
</script>
```

- 组合式写法：直接 import state 与方法，在 template 中绑定 state 或计算属性即可。

## 关键点

- 需要界面随全局数据更新时，用 **reactive + 专用模块**；仅需跨页共享不要求响应式时可用 globalData。

<!--
Source references:
- docs/tutorial/store.md
- docs/collocation/app.md
-->

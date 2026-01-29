---
name: features-navigation
description: 页面跳转与路由 navigateTo、redirectTo、reLaunch、switchTab、navigateBack、参数传递
---

# 路由与页面跳转

## 常用 API

| API | 说明 |
|-----|------|
| **uni.navigateTo** | 保留当前页，跳转到新页；可带 url 参数。 |
| **uni.redirectTo** | 关闭当前页，跳转到新页。 |
| **uni.reLaunch** | 关闭所有页面，打开新页（可作“重启”到某页）。 |
| **uni.switchTab** | 切换到 tabBar 页面，需在 pages.json 中配置 tabBar。 |
| **uni.navigateBack** | 返回上一页或多层，可传 `delta`。 |

## 参数传递

1. **URL 参数**：跳转时在 url 后加 `?key=value&key2=value2`，目标页在 **onLoad(options)** 或 **defineProps** 中接收。
2. **通过 props**：HBuilderX 4.71+ 支持页面通过 props 接收与 url 同名的参数。

示例：

```ts
// A 页跳转
uni.navigateTo({ url: '/pages/detail/detail?id=' + id })

// B 页 onLoad 接收
onLoad(options: OnLoadOptions) {
  const id = options['id'] ?? ''
}
```

## 注意

- tabBar 页面只能用 **switchTab** 跳转。
- dialogPage 不使用上述路由 API，使用 **openDialogPage / closeDialogPage**；在 dialogPage 内调用 navigateTo 等会作用在其 parentPage 上。

<!--
Source references:
- docs/api/navigator.md
- docs/page.md
-->

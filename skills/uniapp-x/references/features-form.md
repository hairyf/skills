---
name: features-form
description: form 表单、submit/reset、form-type、子组件与数据提交
---

# 表单 form

## 子组件

- **form** 内可放：**input**、**textarea**、**checkbox**、**radio**、**switch**、**slider**，以及 **button**（form-type 为 submit 或 reset）。
- **button** 的 **form-type="submit"** 触发表单提交；**form-type="reset"** 触发重置；提交/重置时上述子组件的值会参与。
- 不支持在上述之外再包自定义组件作为“表单项”由 form 统一提交；若有自定义控件，需自行用 data 收集并编码提交。

## 提交与重置策略

- **submit**：提交数据为对象 `{ name: value }`；同名 name 仅保留最后一个；disabled 项仍会提交（与浏览器标准不同）。App/Web 与微信小程序策略一致。
- **reset**：uni-app x 在 App(3.97+)、Web(4.0+) 为**还原**；其他平台见文档。
- 编译到 Web 时仍使用 uni-app 的 form 组件逻辑，非浏览器原生 form。

## 关键点

- 需服务端接收的字段用 **name** 标识；提交时在 form 的 **@submit** 中取 event.detail.value。
- 校验可在 submit 事件里做，不通过则 return 或调 API 前拦截。

<!--
Source references:
- docs/component/form.md
- docs/component/button.md
-->

---
name: minecraft-model-design-prompts
description: Prompt recipes for designing vanilla-Minecraft models with an image model — the vanilla-style pre-prompt (EN/ZH), the design prompt with constraints, the review gate, and the three-view request in the same session. Produces both structure and texture references for Blockbench modeling.
---

# Design Prompts

Before touching Blockbench, design the model with an image model. The design phase is two calls in **one conversation/session**: first generate the design image, then — after review — ask for the three views. The output gives two things at once: the 3D structure scheme and the texture reference.

## 1. Send the vanilla-style pre-prompt

English:

> Role: Expert AI Image Generator for Authentic "Vanilla Minecraft" Art. Objective: Generate 3D voxel and pixel art strictly adhering to Minecraft's low-spec aesthetic. Reject all realism, curves, and HD textures.
>
> 1. GEOMETRY & SHAPE: Construct strictly with 3D cuboids, blocks, and 2D planes. ZERO smooth curves, spheres, cylinders, or slants. Round shapes must be chunky, blocky stair-step approximations.
> 2. RESOLUTION & AVOID MIXELS (CRITICAL): Enforce a uniform pixel ratio across the entire image. ABSOLUTELY NO "MIXELS". Emulate a strict 16x16 texture grid per standard block.
> 3. TEXTURING & COLORS: Use crisp, deliberate pixel-art textures with restricted palettes. Implement Hue Shifting. Do NOT use soft brush strokes, noisy textures, blur, or automated anti-aliasing.
> 4. SHADING & LIGHTING: Keep shading flat and un-smoothed. ABSOLUTELY NO smooth gradients, pillow shading, pancake shading, or banding. Use only strict checkered dithering for transitions.

中文（效果一致，任选其一）：

> 角色：专业的"原版 Minecraft"风格 AI 图像生成器。目标：严格按照 Minecraft 低精度美学生成 3D 体素和像素艺术。拒绝一切写实感、曲线和高清材质。
>
> 1. 几何与形状：必须严格使用 3D 长方体、方块和 2D 平面构建。绝对不允许光滑曲线、球体、圆柱体或斜面。
> 2. 分辨率 & 禁止 MIXELS（关键）：在整张图片中强制执行统一的像素比。绝不混用高分辨率和低分辨率细节。模拟严格的每标准方块 16×16 材质网格。
> 3. 材质与颜色：使用清晰、刻意的像素艺术材质，调色板受限。实施色相偏移。不使用柔和笔刷、噪点材质、模糊或自动抗锯齿。
> 4. 阴影与光照：保持阴影扁平且未平滑。绝对不允许平滑渐变、枕形阴影、薄饼阴影或色带。过渡仅使用严格的棋盘格抖动。

## 2. Describe the model (call 1: design image)

Describe the subject with explicit constraints — footprint, cube-only parts, simple structure, functional requirements, and the 1:1 aspect ratio:

> 生成一格Minecraft蜗牛，蜗牛壳是一个立方体，不要堆叠。蜗牛身体结构简单，有触角。蜗牛足够将整个身体缩回到蜗牛壳内部。请绘制 将宽高比设为 1:1

Pattern: `生成一格Minecraft{主题}，{部位}是一个立方体，不要堆叠。{结构}简单，有{细节}。{功能约束，如可完全缩回壳内}。请绘制 将宽高比设为 1:1`

This call produces the **design image** — the structure scheme and texture reference for the whole model.

## 3. Review the design

The user reviews the design between the two calls. By default the AI reviews it against the requirements that actually affect modeling: chunky cuboids only (no smooth curves/spheres), cube-only parts, no stacking, simple structure with the requested details, unified low-spec pixel style. Do **not** check the composition aspect ratio (e.g. strict 1:1) — the three views are the final output and composition details of the design image are irrelevant; never spend extra calls fixing the design image's framing.

If the AI's judgment is not trusted — or the user is unhappy with the result — involve the user: show the image and ask whether the design is acceptable. Iterate the design prompt with their feedback before generating the three views.

## 4. Request the three views (call 2, same session)

> 非常好，画出它的三视图

The second call **must continue the same conversation/session** so the image model keeps the design. The three views are the modeling blueprint: they align cube sizes, positions, and the texture layout in Blockbench.

Session continuity example (imagine skill):

```bash
node scripts/imagine.js "生成一格Minecraft蜗牛，蜗牛壳是一个立方体，不要堆叠。蜗牛身体结构简单，有触角。蜗牛足够将整个身体缩回到蜗牛壳内部。请绘制 将宽高比设为 1:1" --session snail -o design.png
# review the design...
node scripts/imagine.js "非常好，画出它的三视图" --session snail -o views.png
```

## Key Points

- Two calls, one session: design image first, review, then three views. The design is never re-described from scratch.
- The texture grid is small (each face is only tens of pixels), so sampling colors from the reference is quick.
- Keep the design low-spec: cuboids only, uniform 16x16 pixel grid, flat shading, restricted palette, hue shifting, checkered dithering.
- Without session continuity (stateless generation), the three-view call would lose the design; always reuse the same `--session` name.
- Review only what affects modeling; ignore the design image's framing/aspect ratio to avoid wasting calls before the three views.

<!--
Source references:
- https://ai-kit.xingduansuzhao.com/model (step 1: design with an image model, two-step conversation)
- https://chatgpt.com/share/69fd2821-d14c-83ea-b063-19393f501662 (reference conversation)
-->

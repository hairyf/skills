---
name: veil-v1-tooltips
description: Veil 1 in-world tooltips — the Tooltippable interface, worldspace vs screenspace rendering, color themes, and item data holders.
---

# Veil 1 In-World Tooltips

`foundry.veil.api.client.tooltip.Tooltippable` makes an entity or block entity show a custom tooltip when the player looks at it. Tooltips can be set server-side but are client-prioritized — whatever the client has is what renders.

## Implementing Tooltippable

```java
public class MyBlockEntity extends BlockEntity implements Tooltippable {
    private final List<Component> tooltip = new ArrayList<>();
    private final ColorTheme theme = new ColorTheme();
    private boolean worldspace = true;

    @Override public List<Component> getTooltip() { return this.tooltip; }
    @Override public void setTooltip(List<Component> tooltip) { this.tooltip.clear(); this.tooltip.addAll(tooltip); }
    @Override public void addTooltip(Component component) { this.tooltip.add(component); }
    @Override public void addTooltip(String text) { this.tooltip.add(Component.literal(text)); }
    @Override public boolean isTooltipEnabled() { return !this.tooltip.isEmpty(); }
    @Override public boolean getWorldspace() { return this.worldspace; }
    @Override public ColorTheme getTheme() { return this.theme; }
    @Override public void setTheme(ColorTheme theme) { /* store */ }
    @Override public void setBackgroundColor(int color) { this.theme.addColor("background", new Color(color)); }
    @Override public void setTopBorderColor(int color) { ... }
    @Override public void setBottomBorderColor(int color) { ... }
    @Override public ItemStack getStack() { return ItemStack.EMPTY; }
    @Override public int getTooltipWidth() { return 0; }
    @Override public int getTooltipHeight() { return 0; }
    @Override public int getTooltipXOffset() { return 0; }
    @Override public int getTooltipYOffset() { return 0; }
    @Override public List<VeilUIItemTooltipDataHolder> getItems() { return List.of(); }
    @Override public CompoundTag saveTooltipData() { return new CompoundTag(); }
    @Override public void loadTooltipData(CompoundTag tag) { }
    @Override public TooltipTimeline getTimeline() { return null; }
}
```

## Worldspace vs screenspace

- `getWorldspace() == true` — the tooltip is anchored in-world: block entities anchor to the closest corner to the player and rotate to face them; entities use their position (larger-than-1-block entities have issues).
- `getWorldspace() == false` — rendered as a screenspace overlay.

## Themes & items

Tooltip visuals are driven by the `ColorTheme` (background/border colors — see [Colors & Easings](v1-colors-easings.md)). `getItems()` returns `VeilUIItemTooltipDataHolder`s — each holds an `ItemStack` plus X/Y position functions (partial-tick in, float out) so items can be drawn inside the tooltip. `TooltipTimeline` (from `tooltip.anim`) animates tooltip width/height/offset/contents — still WIP and buggy in v1.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (InWorldTooltips, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: foundry.veil.api.client.tooltip.*)
-->

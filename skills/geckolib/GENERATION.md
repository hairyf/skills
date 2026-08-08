# Generation Info

- **Source:** `sources/geckolib` (https://github.com/bernie-g/geckolib, branch `main`)
- **Git SHA:** `05048071ce4801969237ffdca0b73223e986d94d` (GeckoLib v5.5.3, 2026-06-27)
- **v4 source:** branch `1.20.1`, commit `25a41d7375bb7eeda37dadc04b1e03fe486b33e5` (GeckoLib v4.4.9, 2024-08-30)
- **Docs source:** https://github.com/Tslat/Geckolib-Wiki (live wiki: https://wiki.geckolib.com)
- **Docs SHA:** `168311a49830d256bd8f61dd3ad27c65a4e470fb`
- **v4 docs source:** https://github.com/bernie-g/geckolib.wiki (wiki revision `38d0ee8`, 2024-08-27 — GeckoLib 4 era pages)
- **Generated:** 2026-08-07 (v4 content added 2026-08-08)

## How to update

GeckoLib's docs live in the `Tslat/Geckolib-Wiki` repository (the `bernie-g/geckolib` submodule tracks the library itself). To update:

1. `git -C temp/geckolib-wiki-src fetch && git -C temp/geckolib-wiki-src pull --ff-only` (or clone it fresh)
2. Diff the docs since the SHA above: `git -C temp/geckolib-wiki-src diff 168311a49830d256bd8f61dd3ad27c65a4e470fb..HEAD -- docs/`
3. Update affected `references/*.md` files and this file's SHAs/version
4. Re-run `temp/geckolib-scrape.py` to refresh the `temp/geckolib-wiki5/` snapshot for full-surface gap checks

Wiki page coverage: all 99 GeckoLib 5 wiki pages are covered by the 18 reference files (setup, making-models, entities incl. replaced entities, blocks, items, armor, concepts: animation/controller/geobones/geomodels/rendering, miscellaneous, examples, updating).

GeckoLib 4 (4.4.9 / 1.20.1) coverage: the v4 wiki surface (installation, animatable pattern, geo models, animation controller + defining animations in code, entities, blocks, items, armor, replaced entities, keyframe triggers, render layers, molang incl. full query list, glowmask + animated textures, triggerable animations, data syncing, v3→v4 changes, examples, split sources) plus the 4.4.9 source API is covered by the 15 `v4-*` reference files. Stateless animations / split-source GeoRenderProvider are correctly excluded (added in 4.5+).

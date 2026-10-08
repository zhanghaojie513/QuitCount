# 网页原型 · quit-smoking-prototype

React + Vite 的可运行原型，是 Flutter / Harmony 两端 `docs/*_prototype_sync_checklist.md` 里所指的那个「Web 原型」。

> ⚠️ **2026-10-03 状态：本目录已降级为历史归档，不再作为任何实现或验收依据。**
> 新的视觉与流程基准是 `../design/design-full.html`（27 屏规格）与 `../design/prototype-visual/`（27 屏可点原型稿）。
> 本目录**四条关键规则已经过期**（见下方「已过期的内容」），照它实现会做出错的东西。

## 该不该用（结论）

| 用途 | 还可用吗 | 该用什么 |
|---|---|---|
| 看最新视觉 | ❌ 不要用 | `../design/design-full.html` · `../design/prototype-visual/` |
| 走流程 / 给非设计同学演示 | ❌ 不要用 | `../design/prototype-visual/index.html` |
| 查指标口径 | ❌ 不要用 | `../design/design-spec.md` §4（口径表） |
| 查交互规则（干预分级 / 通知） | ❌ 不要用 | `../design/design-spec.md` §5 |
| 当 Flutter / Harmony 的验收基准 | ❌ **绝对不能** | `../design/design-full.html` |
| 追溯视觉是怎么演进来的 | ✅ 仅此一用 | 本目录 + `../design/process/` |
| 拿可复用代码 | ⚠️ 少量 | 只有 `src/assets/human-lungs-nih.png`（肺部素材仍被两端使用） |

## 已过期的内容（照它做会错）

| # | 本目录里的样子 | 现在的定稿 |
|---|---|---|
| 1 | **色板**：珊瑚风险色 `#F07055` / 薄荷状态面 `#D7F0E5` / 主色 `#0F5C50` / 页底 `#EEF4EE` | 暖琥珀 `#C26B32` / 鼠尾草 `#DFEBE5`·`#F2F7F5` / `#38665F` / `#F8F6F2` —— **全量重做，见 `design-spec.md` §2** |
| 2 | **圆角 8px** | 卡片 18–24 · 按钮 15–16 · 胶囊 999 · 弹层 28 |
| 3 | **首页操作区有「查看资产」按钮**，主卡用长文案「今日取出 4 支 · 目标少于 5 支」 | 「查看资产」**已删除**；只有「今日进度 + 放回库存」；主卡用紧凑文案「库存 17 支 · 今日 4/5 支」 |
| 4 | **取烟 Sheet 底部是「管理库存与默认烟」按钮 + 说明句** | 已改为**快捷品牌行 + 确认 CTA**；且**没有备注字段**（N4 明确不加，两端 checklist 该条也要改成不实现） |
| 5 | 危害分是**只看支数**的分段 | 模型 A1：`100 × (1 − 0.5^(n/5.2)) + clamp((T − 9n) × 0.5, −5, +10)`，**输入支数 + 焦油** |
| 6 | 健康净值 = `100 − 当日 lungScore` | `100 − 近期负担指数`（`0.88 × 前值 + 0.12 × 危害分`，会随时间回落） |
| 7 | 健康折算 = `支数 × 20` **分钟** | `0.43 × 焦油 mg` **元** |
| 8 | 22 屏 | **27 屏**（新增 `01b` `23` `24` `25` `26` `27`） |

## 来源与归档说明

- 原始位置：`D:\product-design-plugin-product-design-role\work\quit-smoking-prototype`
- 归档时间：2026-10-03
- 归档时**排除**了：`node_modules/`、`.npm-cache/`、`dist/`（都可由 `npm install` / `npm run build` 重建）、`.git/`（避免与母仓库形成嵌套仓库）
- ~~全量原始输出（7 张原型/概念图 + 源码 zip）见 `../design/reference/`~~ → **该目录已于 2026-10-03 清理删除**
（旧原型截图、概念图与源码 zip 属已降级的历史归档，且源码本身的归档就是**本目录**，zip 属重复副本）。

## 跑起来

```bash
npm install
npm run dev
```

## 入口

`index.html` 为主入口，另有 `refined.html` / `rich.html` / `balanced.html` / `impact.html` —— 同一原型的不同视觉方案，**都已被 `../design/` 这一版取代**。

## 关于 `qa/`（已清理）

`qa/` 原本有 110 张 png + 2 个 dev log（13 MB），**已于 2026-10-03 删除** —— 那是原型自带的截图回归基线，属死重量。

**删除前核实过一件事：两端文档引用的截图与这里本来就对不上号。**

- 两端 `docs/*_implementation_plan.md` 与 `latest_prototype_sync_checklist.md` 引用的路径是 `qa\screenshots\full-validation\`、`qa/balanced-home-390.png`、`home-actions-simplified.png`；
- 但本目录 `qa/` 是**平铺结构**、没有 `screenshots/` 子目录；`home-actions-simplified.png` 全仓仅存在于 `QuitCountHarmony/outputs/imagegen/…/source/`（那是海报生成素材，不是原型截图）；
- 那些引用实际指向仓库外的 `C:\Users\haiha\Documents\Codex\2026-06-10\…` 与 `D:\product-design-plugin-product-design-role\…`。

也就是说：**两端的「截图对照验收」本来就无法执行**，删掉这些 png 不损失任何有效依据。验收基准应统一换成 `../design/design-full.html` 的 27 屏（自包含单文件，不依赖外部路径）。

保留下来的是 5 个 `.mjs` 验证脚本（源码性质，104 KB）：`verify-product-flow` / `verify-refined-flow` / `verify-settings` / `verify-visual-variants` / `verify-warning-cdp`。

## 源码归档

**源码归档就是本目录。** 原有的两个源码 zip（`../design/reference/` 下的
`quit-smoking-prototype-full-source.zip` / `quit-smoking-prototype-source.zip`）
已于 2026-10-03 **随 `reference/` 目录一并清理删除** —— 它们只是本目录的压缩副本，内容重复。

| 归档位置 | 内容 |
|---|---|
| **本目录**（`../prototype/`） | 全部入口 html（`index` / `balanced` / `impact` / `refined` / `rich`）、`src/` 全部源文件、5 个 `.mjs` 验证脚本、配置与文档 —— **可运行状态** |
| `../design/assets/human-lungs-nih.png` | 肺部插图，两端仍在使用 —— 已从本目录另存一份，保证双点留存 |

本目录保留可运行状态（`src/` 282 KB + 入口 html + `package.json`），删掉的是 `qa/` 的 110 张 png、2 个 log 与 `.npmrc`。

**体积：14 MB → 482 KB（−96.6%）。**

> ⚠️ **注意**：原先删掉的 `.npmrc`（含私有 registry 配置，即 `npm warn` 的来源）**现无法再从 zip 取回** ——
> zip 已删除。如需重建，请向原项目 `D:\product-design-plugin-product-design-role\work\quit-smoking-prototype`
> 索取，或直接跳过（正常情况下 `npm install` 用公共 registry 即可）。

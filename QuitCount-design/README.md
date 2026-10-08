# QuitCount-design ·「戒烟有数」设计资产

本目录是「戒烟有数」**全部设计相关产物的唯一集散地**。三端（Flutter / Harmony / Nest）的仓库不放在这里，改动代码请看各自仓库。

## 目录结构

| 路径 | 内容 |
|---|---|
| `design/` | **设计主目录** —— 设计规范、Token、逐屏设计稿、可点原型、品牌标识、切图、过程稿 |
| `prototype/` | React + Vite 第一版网页原型，**已降级为历史归档**（色板与口径全部过期，勿照搬） |
| `design_rollout_implementation_plan.md` | **设计稿落地实施计划**（差异清单 / P0–P5 阶段 / 验收口径 / 风险清单） |

## 从哪里开始

| 你要做什么 | 看哪里 |
|---|---|
| **逐屏实现某一屏** | **`design/design-full.html`** —— 27 屏唯一视觉基准（393 × 852） |
| **走完整流程 / 给人演示** | `design/prototype-visual/index.html` —— 真机框内真实点击；URL 加 `#s07` 可直达指定屏 |
| **查数字口径 / 颜色 / 圆角** | `design/design-spec.md`（口径表在 §4）· `design/design-tokens.css` / `.json` |
| **按什么顺序改代码** | `design_rollout_implementation_plan.md` |
| **拿 App 图标** | `design/logo/`（iOS 用 `icon-ios-1024.png`；Android / 鸿蒙用自适应分层） |
| **看设计怎么演进来的** | `design/process/`（改造对照与模型标定，含取舍理由） |
| **查设计交付物全图** | `design/README.md` |

## 三条不能破的规则

1. **颜色按语义分配，不按美观分配**。实心品牌绿 `#38665F` 只给「推荐选项」；墨色 `#1A211E` 只做文字色；暖琥珀 `#C26B32` 固定代表「代价」。
2. **破坏性操作里，安全选项才是绿色主按钮**。
3. **一次取出最多打断一次**。

详见 `design/design-spec.md`。

## 权威关系

- 产品规则（公式 / 口径 / 交互 / 通知策略）→ 各端 `docs/product_spec.md`
- 逐屏视觉 → `design/design-full.html` + `design/design-spec.md`
- 实施顺序与验收 → `design_rollout_implementation_plan.md`

冲突时优先级：`product_spec.md` → `design-full.html` → 本目录的实施计划。

> ⚠️ **切图是产物，`design-spec.md` 是权威。** 旧切图目录 `design/screens-v1/`（已过期，导出于若干拍板之前）**已于 2026-10-03 清理删除**，其实质内容（3 处与 spec 冲突的缺陷清单）保留在 `design/audit-notes.md` 的 E1–E3。
> ✅ **替代品已就位**：`design/screens/`（**37 张**，由 `prototype-visual/` 程序化导出，786×1704 = @2x），E1–E3 三处冲突**均已修好**。清单与重导方法见 `design/screens/README.md`。实现仍以 `design-full.html` / `prototype-visual/` 为准。

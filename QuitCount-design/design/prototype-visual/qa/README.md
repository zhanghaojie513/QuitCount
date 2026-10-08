# prototype-visual / qa

`design/prototype-visual` 是 27 屏可点原型模拟器。本目录放**可复跑的验证脚本**，
把「改了一处、别处跟着坏」这类回归拦在提交前。

## 六个脚本

| 脚本 | 测什么 / 产出 | 跑法 |
|---|---|---|
| `verify-regression-27.js` | 结构性回归：27 屏齐全/无重复、每屏 `.screen` 容器唯一且 div 配平、01 五态、02 四态、22/23/24 与 02 同源、25 三态、联动双向、复原、**遮罩 data-close 全覆盖、死控件补线、微交互挂钩、初始口径不变**（2026-10-08 起 204 断言） | `node qa/verify-regression-27.js` |
| `verify-pick-linkage.js` | 08 选烟 → 落点的**数据链**（Node 桩化 window，不比浏览器） | `node qa/verify-pick-linkage.js` |
| `browser-probe.mjs` | **浏览器真点击探针（Node 版，免 Python）**：真实 Chrome 里 `.click()` 走完 08→23 选烟链、遮罩关闭、17/18/05/19 补线、09/12/27 微交互、`#s08/1` 深链（35 断言）。生成 `_probe.html` 并自行调 headless Chrome，断言从 `#PROBE_OUT` 解析 | `node qa/browser-probe.mjs` |
| `make-browser-probe.py` | 生成 `_probe.html`：在**真实浏览器**里 `.click()` 走完 08 → 23，验证 `app.js` 的 `[data-pick]` 绑定真的接上了（只覆盖选烟链；完整覆盖用上面的 Node 版） | 见文件头注释 |
| `make-export-page.py` | 生成 `../_export.html`（重导切图用的中转页，剥掉模拟器外壳） | `python qa/make-export-page.py` |
| `export-screens.py` | 逐屏导出 37 张切图 → `../../screens/` | `python qa/export-screens.py` |

三个 Node 脚本都以退出码表意（全通过 = 0）。**没有 Python 的机器上，
`node qa/browser-probe.mjs` 可以独立完成浏览器层验证** —— 两个 Python 脚本
（探针生成 / 切图导出）才需要 Python + Chrome。

> **临时产物不入库**：`_probe.html` / `_export.html` / `_shot*.png` 都是**每次跑脚本自动重生**的中转文件，
> 已写进 `QuitCount-design/.gitignore`。**看不到它们是正常的** —— 需要时跑一次对应脚本即可。
> 后四个脚本的清单也是**自动**的：`export-screens.py` 会跑 Node 读 `screens.js` 的屏与状态，
> 所以改屏/改态不用改脚本（手工数屏会被注释里的示例文字骗，见下）。

## 为什么要分成「Node 桩化」和「浏览器真点击」两层

桩化跑得快、能查数据链，但**看不到 `app.js` 里的事件绑定**。
本项目就踩过一次：screens.js 的数据全对，但 `[data-pick]` 没绑，
点上去毫无反应 —— 桩化测试全绿。所以跨屏/交互类的改动，
必须同时过浏览器探针这一关（现在 `node qa/browser-probe.mjs` 一条命令即可）。

## 一个已知的读输出陷阱

`--dump-dom` 的结果要先 `grep -o "RESULT::[^<]*"` 再 `sed 's/RESULT:://'`，
**最后**才 `tr '|' '\n'`。顺序反了（先 tr）会把断言名连同页面里的 `|` 一起切碎，
看到的是一堆乱行而不是断言列表。

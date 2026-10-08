# HarmonyOS 图标资源（可直接替换）

本目录是按 `QuitCountHarmony` **现有规格实测后**导出的一套资源，用途是把旧标识（「呼吸计数」：薄荷肺 + 珊瑚轨迹）换成新设计稿的标识。

## 规格是怎么定的（实测，不是猜的）

| 项 | 旧资源实测 | 本次输出 |
|---|---|---|
| 分层图标画布 | 1024 × 1024 RGBA | 同 |
| 前景层内容占比 | `entry` 54.1% · `AppScope` 67.4%（两处不一致） | **统一 60.5% × 49.9%**，居中 |
| 启动图标尺寸 | 288 × 288 RGBA，圆角约 25.3% | 288，圆角 25% |
| 独立图标尺寸表 | 1024 / 512 / 288 / 256 / 192 / 128 / 96 / 64 / 48 | 同 |

前景层收到 60% 是**有意的**：HarmonyOS 会对前景层做视差/缩放，内容必须留出安全区。三种遮罩（圆形 / 方形 / 水滴）实测均不切到内容，见 `_preview.png`。

## 替换清单

| 本目录文件 | 目标路径 | 说明 |
|---|---|---|
| `background-1024.png` | `entry/src/main/resources/base/media/background.png` | 分层图标背景层，**满幅不透明**，不要做圆角 |
| `foreground-1024.png` | `entry/src/main/resources/base/media/foreground.png` | 分层图标前景层，**透明底**，标识居中 |
| `background-1024.png` | `AppScope/resources/base/media/background.png` | 同上（AppScope 那份也一并换，否则两处不一致） |
| `foreground-1024.png` | `AppScope/resources/base/media/foreground.png` | 同上 |
| `startIcon-288.png` | `entry/src/main/resources/base/media/startIcon.png` | 启动图标，圆角方形 |
| `app-icon-*.png` | `QuitCountHarmony/outputs/logos/quitcount-app-icon-<新日期>/final/` | 独立图标尺寸套件（新目录，旧的 `quitcount-app-icon-20260714/` 保留不动，便于回退） |

`layered_image.json` 与 `app.json5` / `module.json5` **无需改动** —— 它们引用的是 `$media:background` / `$media:foreground` / `$media:layered_image`，换的是文件内容，不是引用。

## 替换后必须验证

```powershell
rtk powershell.exe -NoProfile -Command "$env:DEVECO_SDK_HOME='F:\DevEco Studio\sdk'; $env:_JAVA_OPTIONS='-Xmx512m'; & 'F:\DevEco Studio\tools\hvigor\bin\hvigorw.bat' assembleHap --no-daemon --mode module -p module=entry@default -p product=default"
```

真机上重点看两件事：**启动图标的圆角是否与系统遮罩对齐**、**桌面分层图标在圆形与方形主题下是否被切边**。这一步需要 DevEco SDK，我没有执行。

## 图标之外，新设计稿还要求鸿蒙改什么

图标只是入口。这一版设计稿相对旧版有这些**会改到界面**的变化，实现前请先读 `../../design-spec.md`：

1. **首页操作区**：删掉「取出一支」（与 Tab 中间 FAB 重复），换成「今日进度」卡
2. **指标改名**：`肺部负担指数` → **`近期负担指数`**；`真实日耗` → **`今日成本`**；`连续记录` → **`已记录天数`**
3. **危害分五档改名**：`轻微/关注/高危/强烈警示/严重` → **`轻负担/偏低/中等/偏高/重负担`**
4. **模型重标定**：危害分换饱和曲线；负担指数引入衰减（λ = 0.12，半衰期 5.42 天），健康净值从此会回升；档位阈值 `20/40/60/80`
5. **数据口径**：新增「累计花费」，并与「今日成本」「库存健康负债」严格区分时间尺度
6. **干预分级**：一次取出最多打断一次，触发基准是用户自设目标
7. **新增第 22 屏**「忍住反馈」：点「好，今天先不抽」后的正反馈条

**数字口径以 `../../design-spec.md` 第 4 节为唯一权威**，与旧原型的实现冲突时以它为准。

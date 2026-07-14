# ADR-004：本地先写、服务端增量同步

- 状态：accepted
- 日期：2026-07-14
- 责任角色：后端负责人、Harmony 负责人
- 客户端评审门禁：Stage 6 前

## 决策

Harmony repository 始终先完成本地写入，网络同步由后台 outbox 协调器执行。用户未明确启用同步前不注册账户、不上传现有本地数据。

服务端提供 `bootstrap`、`push`、`pull`：

- `push` 按项返回 `applied`、`duplicate`、`conflict` 或 `pending_dependency`。
- `pull` 使用用户隔离、单调、opaque cursor，返回 canonical change 和 tombstone。
- 可变资料用显式 base version 合并/冲突；账本事件 append-only，禁止全对象 LWW。
- 服务端接收时间不替代客户端行为发生时间；客户端墙上时钟不决定覆盖顺序。

## 冲突原则

多设备同时消耗最后库存时，只接受满足库存不变量的事务；被拒离线事件保留在客户端并显示冲突。默认资产冲突由服务端用户级事务收敛，客户端以后续 pull 为准。

## 后果

核心流程离线可用，但客户端需要 outbox、同步状态和冲突 UX；服务端需要永久事件去重、change log、墓碑和游标保留策略。


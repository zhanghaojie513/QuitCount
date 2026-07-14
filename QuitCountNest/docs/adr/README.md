# 架构决策记录索引

> Stage 0 基线，2026-07-14。状态含义：`accepted` 可进入后续实现；`proposed` 仍需指定角色在门禁前确认；`superseded` 仅由新 ADR 替代，禁止直接改写历史决定。

| ADR | 决策 | 状态 | 责任角色 | 最迟确认门禁 |
| --- | --- | --- | --- | --- |
| [ADR-001](./ADR-001-modular-monolith.md) | 模块化单体与边界 | accepted | 后端负责人 | 已确认 |
| [ADR-002](./ADR-002-runtime-framework-database.md) | Node/Nest/PostgreSQL 主版本 | accepted | 后端负责人、运维负责人 | Stage 2 前复核运行环境 |
| [ADR-003](./ADR-003-orm-and-migrations.md) | Prisma 与迁移所有权 | accepted | 后端负责人、DBA | Stage 2 首个 migration 前 |
| [ADR-004](./ADR-004-local-first-sync.md) | 本地优先同步与 change log | accepted | 后端负责人、Harmony 负责人 | Stage 6 前完成客户端评审 |
| [ADR-005](./ADR-005-immutable-ledger.md) | 不可变账本与库存事务 | accepted | 后端负责人、产品负责人 | Stage 5 前复核跨日 return UX |
| [ADR-006](./ADR-006-money-time-local-day.md) | 金额、时间与自然日 | accepted | 后端负责人、产品负责人 | Stage 4 前确认历史舍入 |
| [ADR-007](./ADR-007-auth-account-upgrade.md) | 可选账户与认证升级路径 | proposed | 产品负责人、安全负责人 | Stage 3 开始前 |
| [ADR-008](./ADR-008-model-versioning.md) | 模型版本与历史快照 | accepted | 产品负责人、后端负责人 | 首次模型升级前复核 |
| [ADR-009](./ADR-009-privacy-lifecycle.md) | 导出、删除、保留、备份 | proposed | 隐私/法务、运维负责人 | Stage 7 开始前 |
| [ADR-010](./ADR-010-asset-versions-default-lock.md) | 资产双版本与默认资产锁 | accepted | 后端负责人、DBA | Stage 4 migration 前 |
| [ADR-011](./ADR-011-bootstrap-dedup-dependencies.md) | bootstrap 水位、永久去重、依赖组 | accepted | 后端负责人、Harmony 负责人 | Stage 6 migration 前 |

## 维护规则

- ADR 只记录跨模块、难以回滚或影响契约/数据的决定；普通实现细节放模块文档。
- `accepted` ADR 的破坏性修改必须新建 ADR 并将旧记录标为 `superseded`。
- `proposed` ADR 不得被实现成既定供应商、SLA 或合规承诺。
- OpenAPI、迁移和代码若与 ADR 冲突，先停止实现并修正决策链。


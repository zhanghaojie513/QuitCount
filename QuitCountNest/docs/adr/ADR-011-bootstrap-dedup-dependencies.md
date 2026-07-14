# ADR-011：bootstrap 水位、永久事件去重与依赖组事务

- 状态：accepted
- 日期：2026-07-14
- 责任角色：后端负责人、Harmony 负责人

## bootstrap 水位

首次 bootstrap 固定用户级 `snapshotSeq`。所有分页 token 都绑定用户、快照水位、资源段和排序键，并签名/防篡改。分页只返回 `lastChangeSeq <= snapshotSeq` 的 canonical 资源；水位之后的完整 change 由后续 pull 返回。禁止跨 HTTP 请求保持长数据库事务。

bootstrap 完成响应返回从 `snapshotSeq` 开始的 pull cursor。游标过期显式返回 `SYNC_CURSOR_EXPIRED`，客户端重新 bootstrap，不得静默漏数据。

## 永久事件去重

账本/同步 mutation 使用 `(userId, deviceId, clientMutationId)` 永久唯一约束，并保存规范化 payload hash 和 canonical 结果引用。短期 HTTP `Idempotency-Key` 响应缓存可过期，但领域去重记录不能因缓存过期消失。同键不同 payload 返回冲突。

## 依赖组事务

push 批次先按 `dependsOnMutationIds`/`reversesEventId` 建图并检测环。显式依赖链按拓扑顺序在同一依赖组事务执行；组内任一硬冲突回滚该组。缺失上游返回 `pending_dependency`，不猜测关联。互不依赖组可分别提交并逐项返回结果。

## 验证

覆盖跨批次重复、缓存过期重放、同键异 payload、乱序 return、循环依赖、bootstrap 分页期间更新、墓碑和游标过期 fixture。


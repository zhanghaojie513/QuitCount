# ADR-001：采用模块化单体

- 状态：accepted
- 日期：2026-07-14
- 责任角色：后端负责人
- 关联：[后端技术设计](../backend_technical_design.md)、[工程规则](../backend_rules.md)

## 背景

资产库存、不可变账本、默认资产和同步 change log 需要短事务保持强一致。当前没有容量、团队所有权或合规隔离证据支持微服务成本。

## 决策

采用单一 NestJS 11 应用和单一 PostgreSQL 数据库，以 `health`、`auth/account`、`users`、`devices`、`assets`、`ledger`、`goals`、`settings`、`sync`、`privacy/data-lifecycle` 模块划分边界。跨模块调用通过公开 application service，不直接访问其他模块私有 repository。

CSV 导出与本地通知继续由 Harmony 客户端负责；首版服务端不发送提醒、不阻止取烟。

## 后果

- 优点：事务清晰、部署简单、调试和恢复成本低。
- 代价：需要严格模块依赖和数据所有权，避免演化成无边界单体。
- 拆分触发条件：经测量的独立扩缩容需求、独立合规域或稳定团队所有权；拆分前另立 ADR。

## 验证

Stage 1/2 通过模块依赖检查；Stage 5 验证库存与账本同事务；任何网络内 RPC 拆分均需新 ADR。


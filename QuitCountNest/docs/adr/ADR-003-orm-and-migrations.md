# ADR-003：采用 Prisma，迁移由受审 SQL 负责

- 状态：accepted
- 日期：2026-07-14
- 责任角色：后端负责人、DBA
- 复核门禁：Stage 2 首个 migration 前

## 决策

选择 Prisma ORM，不混用 TypeORM。普通模型和类型安全查询由 Prisma 管理；部分唯一索引、检查约束、必要触发器和并发细节由可审查 SQL migration 补充。

迁移文件进入版本控制，只前进，不在共享环境改写历史。生产禁止 `db push`、`synchronize` 或启动时自动变更 schema。应用运行账户不拥有 DDL 权限，迁移使用独立受控身份。

## 依据

本项目需要类型安全 DTO 映射，也需要 PostgreSQL 原生约束保证默认资产唯一、库存非负和永久去重。ORM 不能替代数据库不变量。

## 备选与否决

- TypeORM：可行，但团队未提供偏好证据；其 decorator/repository 优势不足以抵消两套迁移语义。若改选需新 ADR。
- 纯 SQL：控制力强，但当前阶段会增加模型和类型维护成本。

## 验证

Stage 2 在空库和前一版本快照执行 migration smoke；校验约束实际存在；Prisma 版本在安装时精确固定并验证 Node 24 支持。


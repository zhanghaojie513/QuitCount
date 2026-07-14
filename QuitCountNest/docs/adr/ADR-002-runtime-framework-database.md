# ADR-002：Node、NestJS 与 PostgreSQL 主版本

- 状态：accepted
- 日期：2026-07-14
- 责任角色：后端负责人、运维负责人
- 复核门禁：Stage 2 连接真实运行环境前

## 决策

- 开发/CI 基线：Node.js `24.16.0`、npm `11.13.0`，由 `.node-version`、`engines`、lockfile 固定。
- 框架：NestJS 11；后续代码只使用 NestJS 11 支持且未废弃的 API。
- HTTP adapter：NestJS 11 默认 Express 5；路由语法按 Express 5/NestJS 11 验证，不照搬旧版通配符写法。
- 数据库：PostgreSQL 18 的当前安全 minor；若最终托管平台在 Stage 2 不支持 18，可经 ADR 修订回退 PostgreSQL 17 当前 minor。
- OpenAPI：首期使用 3.0.3，API 版本为 `/api/v1`。

## 依据

NestJS 11 官方要求 Node.js 20+；Prisma 当前支持 Node 24 和 PostgreSQL 18；PostgreSQL 18 官方支持至 2030。主版本固定不等于固定过时 minor，安全 minor 必须持续升级。

## 后果与门禁

- 本地、CI、容器必须使用同一 Node 主版本；生产镜像 digest 待运维确认。
- 升级 NestJS 主版本必须先读官方 migration guide，并通过 lint、typecheck、unit、E2E、OpenAPI diff。
- 运行环境/架构、托管平台、HA 等仍是待运维确认，不由本 ADR虚构。

## 官方依据

- [NestJS 11 migration guide](https://docs.nestjs.com/migration-guide)
- [Prisma system requirements](https://docs.prisma.io/docs/orm/reference/system-requirements)
- [Prisma supported databases](https://docs.prisma.io/docs/orm/reference/supported-databases)
- [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/)


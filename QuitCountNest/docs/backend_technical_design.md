# 戒烟有数后端技术设计

> 状态：设计草案，2026-07-14。NestJS 11 最小工程已初始化；数据库、云账号、短信供应商、域名、部署环境和领域业务仍不存在。

## 1. 文档定位与事实标记

本文与 [后端实施计划](./backend_implementation_plan.md)、[后端工程规则](./backend_rules.md) 共同构成后端基线。固定产品规则不在三处重复维护；冲突时按工程规则中的优先级处理。

- **【已确认事实】**：来自 `QuitCountHarmony/docs/product_spec.md`、指定的 Harmony 报告与当前 ArkTS 源码。
- **【建议选型】**：适合空目录起步的保守方案，必须通过 ADR 决策后才成为工程事实。
- **【待产品/运维确认】**：会影响契约、成本、合规或部署的开放决策。

权威输入位于只读项目 `E:\myProject\QuitCount\QuitCountHarmony`。其中 `docs/product_spec.md` 是最终产品规则源；客户端源码只是已落地证据，发生冲突时规格优先。

本次已核对的来源清单：

1. `docs/product_spec.md`
2. `docs/harmonyos_implementation_plan.md`
3. `docs/latest_web_prototype_sync_checklist.md`
4. `docs/reports/phase_5_services_persistence_report.md`
5. `docs/reports/phase_6_testing_acceptance_report.md`
6. `docs/reports/phase_8_latest_web_prototype_sync_report.md`
7. `entry/src/main/ets/domain/models/QuitModels.ets`
8. `entry/src/main/ets/domain/AssetValidator.ets`
9. `entry/src/main/ets/domain/QuitCalculator.ets`
10. `entry/src/main/ets/features/home/QuitHomeViewModel.ets`
11. `entry/src/main/ets/data/QuitRepository.ets`
12. `entry/src/main/ets/services/NotificationService.ets`
13. `entry/src/main/ets/services/CsvExportService.ets`

## 2. 背景、目标与非目标

### 2.1 当前状态

**【已确认事实】** HarmonyOS 手机端首版是本地优先应用：资产、账本、目标和设置保存在本机；账户与跨设备同步仍是占位状态，不上传数据。当前 CSV 由 `CsvExportService` 通过系统文件选择器保存；严厉危害三连提醒与每日复盘由 `NotificationService` 在手机本地调度。设备级通知、导出、持久化和多尺寸验收仍有未验证项。

**【已确认事实】** 后端目录已使用 `mise` 管理的 Node.js `24.16.0`、npm `11.13.0` 初始化 NestJS 11 TypeScript 工程；当前安装的核心运行包为 `@nestjs/common`、`@nestjs/core`、`@nestjs/platform-express` `11.1.28`。这只表示工程骨架可构建、测试和启动，不表示 Stage 1 已完整完成，也不表示任何后端业务、数据库或云同步已经存在。

因此，后端必须分阶段启用。不能声称当前客户端已经依赖后端，也不能让手机核心“取出一支—扣库存—写账本”路径等待网络成功。

### 2.2 目标

- 为可选账户、跨设备同步、云端数据生命周期和未来多客户端提供稳定服务端基础。
- 以版本化 REST/OpenAPI 契约连接 Harmony 客户端，支持本地先写、稍后同步。
- 保持资产唯一默认项、库存非负、不可变账本、精确金额、公式版本等领域不变量。
- 提供可审计的认证、隐私、导出、删除、备份恢复和安全控制。
- 允许后端先独立完成基础设施与契约，而不改变 Harmony 首版离线可用性。

### 2.3 非目标

- 不重新定义客户端 UI、弹窗、Sheet、震动或导航。
- 首版后端不发送严厉危害三连推送或每日复盘推送，不阻止取烟。
- 不替代客户端 CSV 导出；未来云端导出是独立能力。
- 不提供医学诊断、治疗建议、社区、商城或香烟购买推荐。
- 当前初始化范围仅限 NestJS 11 工程骨架和质量脚本；不实现领域业务，不创建数据库或云资源。

## 3. 推荐技术栈

| 领域 | 建议 | 依据与边界 |
| --- | --- | --- |
| Runtime | **【已确认事实】开发基线为 Node.js `24.16.0` + npm `11.13.0`**；生产镜像仍待运维确认 | `.node-version`、`packageManager` 和 `engines` 已固定开发主线；截至 2026-07-14，Node 24 为 LTS。生产只使用受支持 LTS，并固定镜像 digest。参考 [Node.js Releases](https://nodejs.org/en/about/previous-releases)。 |
| 框架 | **【已确认事实】NestJS 11 工程已初始化** | 当前核心运行包为 `11.1.28`。后续实现必须以 NestJS 11 官方文档和已安装类型定义为依据，不得新增已废弃 API；升级框架前先做 migration guide、编译、测试和契约验证。参考 [NestJS migration guide](https://docs.nestjs.com/migration-guide)。 |
| HTTP | REST JSON + `/api/v1` + **OpenAPI 3.0.3** | **【建议选型】** 3.0.3 与 NestJS `@nestjs/swagger` 的 code-first 工具链更稳妥；同步用专用批量端点。若未来必须使用 OpenAPI 3.1，应改为 contract-first，并在 ADR 中确认生成器、lint、客户端代码生成和兼容性验证，不得只改版本号。 |
| 数据库 | **【建议选型】PostgreSQL 17 或 18 的当前 minor** | 事务、约束、部分唯一索引、`timestamptz`、`numeric`、JSONB 和增量游标适合本领域。主版本由运维按托管支持、升级窗口和插件兼容性 ADR 定版；官方主版本支持周期为 5 年，参考 [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/)。 |
| ORM/迁移 | **【建议选型】Prisma ORM + 受审 SQL migration** | 类型安全、schema 与迁移可审查；部分唯一索引、触发器/约束用 SQL migration 补充。事务需短小。参考 [Prisma transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions) 与 [PostgreSQL connector](https://www.prisma.io/docs/orm/v6/overview/databases/postgresql)。 |
| ORM 备选 | TypeORM + 显式 migration | 若团队更熟悉 decorator/repository、需更直接操控 SQL，可选 TypeORM。禁止运行时 `synchronize: true`。选型必须记录 ADR，不混用两套 ORM。 |
| 配置 | `@nestjs/config` + 启动时 schema 校验 | 缺少关键配置应快速失败；密钥只来自 secret manager/运行环境，不提交仓库。 |
| 日志 | Pino 结构化 JSON + request/correlation ID | 支持字段脱敏、低开销与集中检索；不记录令牌、验证码、完整备注或导出内容。 |
| 测试 | Jest、Supertest、Testcontainers/PostgreSQL、OpenAPI contract tests | 单元、集成、端到端和真实数据库约束分层验证。Testcontainers 是否可用于 CI 由运行器能力确认。 |
| 容器化 | 非 root、多阶段 OCI 镜像；本地用 Compose | 镜像只含生产依赖，固定 digest，提供健康检查；不把 Compose 视为生产编排。 |
| CI | lint、typecheck、unit、integration、migration smoke、OpenAPI diff、image scan | GitHub Actions、GitLab CI 或其他平台尚未确认，流水线语义先固定。 |

## 4. 总体架构与模块边界

采用模块化单体作为第一阶段形态。当前规模不需要微服务；事务性库存与账本应尽量保持在同一 PostgreSQL 事务内。未来只有在容量、团队所有权或合规隔离出现证据后再拆分。

| NestJS 模块 | 服务端职责 | 明确边界 |
| --- | --- | --- |
| `health` | liveness、readiness、版本与依赖状态 | 不泄露配置、连接串或内部拓扑。 |
| `auth` / `account` | 注册/登录方案、token 轮换、会话撤销、账户高风险操作 | Harmony 首版不强迫登录；短信/邮箱/第三方登录供应商未确定。 |
| `users` | 最小用户资料、状态、区域/时区偏好 | 不采集非必要健康、通讯录或广告画像。 |
| `devices` | 设备注册、同步身份、最后活动、撤销 | 不把设备 ID 当作唯一认证因素。 |
| `assets` | 香烟资产、默认资产唯一性、软删除、库存物化值 | 不管理购买或推荐。 |
| `ledger` | `take`/`return`/`retire` 不可变事件、关联、风险快照 | 禁止原地编辑/删除已接受账本事件。 |
| `goals` | 每日目标、干预线、版本 | 只表达行为目标，不输出医疗处方。 |
| `settings` | 可同步的业务设置与版本 | 通知权限、提醒调度、震动仍由客户端执行。 |
| `sync` | bootstrap、push、pull、游标、幂等、冲突、墓碑 | 不让网络阻塞客户端本地记账。 |
| `privacy` / `data-lifecycle` | 云端导出、账户删除、保留策略、审计与任务状态 | “重置本地数据”绝不等同于删除云账户数据。 |

横切能力包括 `common`（错误、验证、Guard、Interceptor）、`database`、`observability` 与 `audit`。CSV 和本地通知不是后端模块职责；若未来新增云端导出或推送，必须单独立项与获得授权。

## 5. 领域模型与表结构建议

### 5.1 通用约定

- 主键建议 UUIDv7/ULID；客户端离线创建的领域对象使用客户端生成 UUID，服务端不得重写。
- 所有用户域表含 `user_id`，查询必须显式限定租户；数据库约束和测试同时防越权。
- 时间持久化为 UTC `timestamptz`，API 为带 `Z`/offset 的 ISO 8601。事件另存 `local_date`、`timezone_offset_minutes`，用于还原客户端自然日。
- 普通可变资源含 `version bigint`、`created_at`、`updated_at`；资产需拆分 `profile_version` 与 `stock_revision`，避免 take 导致资料编辑产生伪冲突。删除用 `deleted_at` 与变更墓碑。
- 参与 bootstrap 的 canonical 资源保存 `last_change_seq bigint`；该值与对应 `change_log.seq` 在同一事务内写入，用于水位一致性分页。
- 金额优先使用最小货币单位 `bigint`（如 `pack_price_fen`、`cost_fen`）并带 `currency char(3)`；若支持非整数最小单位，再用受限 `numeric(p,s)`。禁止浮点持久化金额。

### 5.2 核心表

| 表 | 关键字段（建议类型） | 索引、约束与关系 |
| --- | --- | --- |
| `users` | `id uuid`、`status enum`、`locale varchar`、`timezone varchar`、`created_at timestamptz`、`deletion_requested_at` | `status` 控制 active/locked/deletion_pending/deleted；不放密码明文。 |
| `auth_identities` | `id`、`user_id`、`provider`、`provider_subject`、`password_hash?`、`verified_at` | `unique(provider, provider_subject)`；密码只存强哈希。验证码存短期哈希/挑战记录。 |
| `refresh_sessions` | `id`、`user_id`、`device_id`、`token_hash`、`expires_at`、`revoked_at` | token 轮换与重用检测；只存 hash。 |
| `devices` | `id uuid`、`user_id`、`client_instance_id`、`platform`、`app_version`、`last_seen_at`、`revoked_at` | `unique(user_id, client_instance_id)`；同步请求绑定设备与会话。 |
| `assets` | `id uuid`、`user_id`、`brand varchar(16)`、`tar_mg numeric(5,2)`、`nicotine_mg numeric(4,2)`、`opening_stock_count int`、`stock_count int`、`pack_price_fen bigint`、`currency`、`is_default bool`、`profile_version bigint`、`stock_revision bigint`、`last_change_seq bigint`、`deleted_at` | `check(stock_count >= 0)`；同一用户仅一个未删除默认资产的部分唯一索引；资料更新只增加 `profile_version`，账本投影只增加 `stock_revision`；被账本引用后禁止硬删。 |
| `ledger_events` | `id uuid`、`user_id`、`device_id`、`client_mutation_id`、`asset_id`、`action enum`、`cigarettes int`、`effective_at`、`received_at`、`local_date`、`timezone_offset_minutes`、`scene`、`note`、`tar_mg_snapshot`、`cost_fen`、`health_minutes`、`reverses_event_id?`、`batch_id?`、`model_version_id`、`risk_snapshot jsonb`、`change_seq bigint`、`sync_status` | 仅追加；`unique(user_id,device_id,client_mutation_id)` 永久去重；`cigarettes > 0`；`return` 必须关联同用户未被撤销的 `take`；对 `reverses_event_id` 建唯一约束；常用索引 `(user_id,effective_at desc,id)`、`(user_id,asset_id,effective_at)`。 |
| `goals` | `id`、`user_id`、`daily_target int`、`intervention_line int`、`effective_from`、`version`、`last_change_seq`、`deleted_at` | 值域由产品确认；若只保留当前值可 `unique(user_id) where deleted_at is null`，历史通过 change log/audit 留痕。 |
| `user_settings` | `user_id pk`、`strict_risk_alert_enabled`、`smoke_feedback_enabled`、`daily_review_enabled`、`daily_review_time_local time`、`sync_enabled`、`version`、`last_change_seq` | `localFirstEnabled` 是产品承诺，不应作为可关闭服务端开关；本地通知权限不上传。 |
| `model_versions` | `id`、`code`、`version`、`status`、`parameters jsonb`、`effective_from`、`retired_at`、`checksum` | `unique(code,version)`；发布后只读。参数与代码 checksum 用于历史复现。 |
| `change_log` | `seq bigserial`、`user_id`、`entity_type`、`entity_id`、`operation`、`entity_version`、`payload jsonb`、`server_time` | `(user_id,seq)` 是 pull 主游标；payload 保存该次同步所需的完整 canonical DTO，删除写 tombstone，不暴露其他用户序列。 |
| `sync_client_cursors` | `user_id`、`device_id`、`last_pulled_seq`、`last_push_at`、`updated_at` | `unique(user_id,device_id)`；用于诊断与安全压缩，不替代客户端提交游标。 |
| `idempotency_records` | `user_id`、`device_id`、`key`、`request_hash`、`status_code`、`response jsonb`、`expires_at` | `unique(user_id,device_id,key)`；相同 key 不同 body 返回冲突。该表只是有期限的响应缓存，不能替代领域对象 ID 和 `client_mutation_id` 的永久唯一约束。 |
| `audit_events` | `id`、`actor_user_id?`、`actor_type`、`action`、`target_type`、`target_id`、`result`、`metadata jsonb`、`created_at` | 仅记录必要元数据；不可含 token、验证码和完整用户备注。 |
| `data_lifecycle_jobs` | `id`、`user_id`、`type export/delete`、`status`、`requested_at`、`confirmed_at`、`completed_at`、`failure_code` | 高风险流程可追踪、可重试、可审计；导出文件短期有效。 |

### 5.3 关键不变量

1. 每个用户任意时刻只能有一个未删除的默认取烟资产。切换默认项时先锁定 `users` 父行（`SELECT ... FOR UPDATE`），再清除旧默认、设置新默认并写 change log；全部在一个短事务中完成，以数据库部分唯一索引兜底。对 SQLSTATE `40001`/`40P01` 做有限次数、带抖动重试。
2. 资产表单按产品规格验证：品牌必填且最多 16 字；焦油 `1–20mg`；尼古丁 `0.1–3mg`；初始库存 `1–200` 整数；整包价格 `1–200` 元。服务端不能只依赖客户端校验。
3. 账本动作只允许 `take`、`return`、`retire`。`return` 是新事件，不修改原 `take`，且必须通过 `reversesEventId` 追溯；同一取出事件最多被有效返回一次。`retire` 建议按资产生成事件并用 `batchId` 聚合，以避免当前客户端“所有库存记在默认资产”造成审计失真。
4. 资产物化库存变更与账本接受必须同一事务；库存不得小于 0。take/return/retire 只增加 `stock_revision`，不改变 `profile_version`。冲突事件不得静默丢弃或改写。
5. 金额不使用 IEEE-754 浮点持久化；取出时快照 `costFen`，返回使用原取出快照的相反数。
6. UTC 是服务端存储基准；客户端按本地自然日展示。服务端若计算日维度，使用事件上传的有效时区信息并保留原始值。
7. `netHealth = clamp(100 - lungScore, 0, 100)`，禁止使用 `100 - dailyHarmScore`。
8. 每个风险快照必须携带 `modelVersion`；已发布模型版本与历史快照不可静默回写。

## 6. REST API 草案

### 6.1 契约约定

- 基础路径：`/api/v1`；媒体类型 `application/json`。破坏性变更进入 `/api/v2`，非破坏字段按兼容规则演进。
- 鉴权：短期 access token + 可轮换 refresh session；移动端使用系统安全存储。具体登录方式待确认。
- 写请求使用 `Idempotency-Key`；普通可变资源更新携带 `If-Match: "<version>"` 或 body `baseVersion`。资产资料使用 `baseProfileVersion`，库存变化由账本与 `stockRevision` 管理，客户端不得直接覆盖库存。
- 列表使用 opaque cursor：`?limit=50&cursor=...`，默认 50、最大 200；禁止 offset 作为同步游标。
- 所有响应带 `requestId`；同步响应额外带 `serverTime`、`nextCursor`、`hasMore`。
- DTO 启用白名单、拒绝未知危险字段、长度/枚举/数值范围验证；OpenAPI 是客户端生成与契约测试源。

DTO 建议按用途而非数据库表命名，例如 `CreateAssetRequest`、`UpdateAssetRequest`、`AssetResponse`、`AppendLedgerEventRequest`、`LedgerEventResponse`、`SyncPushRequest`、`SyncPushResponse`。资源响应至少包含稳定 `id`、版本信息、ISO 时间和明确单位；`AssetResponse` 分别返回 `profileVersion` 与 `stockRevision`。列表响应统一为 `{ "items": [], "nextCursor": null, "hasMore": false, "serverTime": "..." }`，不得直接暴露 ORM entity 或数据库列名。

统一错误示例：

```json
{
  "error": {
    "code": "ASSET_PROFILE_VERSION_CONFLICT",
    "message": "资产已在其他设备更新",
    "requestId": "01J...",
    "details": [{ "field": "profileVersion", "reason": "stale", "currentProfileVersion": 8 }],
    "retryable": false
  }
}
```

### 6.2 主要 endpoint

| 方法与路径 | 用途 | 幂等/并发要点 |
| --- | --- | --- |
| `GET /health/live`、`GET /health/ready` | 存活/就绪 | ready 检查必要依赖；响应不含敏感配置。 |
| `POST /auth/register`、`POST /auth/login`、`POST /auth/refresh`、`POST /auth/logout` | 账户与会话 | 供应商和凭证策略待确认；登录限流。 |
| `GET /users/me`、`PATCH /users/me` | 最小资料 | `If-Match`。 |
| `POST /devices`、`GET /devices`、`DELETE /devices/{id}` | 注册/撤销设备 | 撤销设备同时撤销相关 session。 |
| `GET /assets`、`POST /assets`、`PATCH /assets/{id}`、`DELETE /assets/{id}` | 资产与软删除 | 创建/更新幂等；资料写使用 `baseProfileVersion`，不直接接受 `stockCount` 覆盖；版本冲突不 LWW。 |
| `PUT /assets/{id}/default` | 原子切换默认资产 | 锁定用户父行 + 短事务 + 部分唯一索引；使用 `baseProfileVersion`，返回 canonical 默认项和同步游标。 |
| `GET /ledger-events`、`POST /ledger-events` | 查询/追加账本事件 | POST 幂等；已接受事件不提供 PATCH/DELETE。 |
| `GET /goals/current`、`PUT /goals/current` | 当前目标 | 乐观并发；保留变更记录。 |
| `GET /settings`、`PATCH /settings` | 可同步设置 | 字段级合并或版本冲突；本地权限不在 DTO。 |
| `POST /sync/bootstrap` | 首次登录/重建本地同步基线 | 分页返回 canonical snapshot、tombstone、cursor、serverTime。 |
| `POST /sync/push` | 批量上传本地 mutations/events | 每项有 `clientMutationId`、`idempotencyKey`；可变资料按类型携带 `baseProfileVersion` 或 `baseVersion`，账本事件不伪造可变版本；逐项结果。 |
| `GET /sync/pull?cursor=...&limit=...` | 拉取增量 change log | 游标单调、分页稳定；过期返回 `SYNC_CURSOR_EXPIRED` 并要求 bootstrap。 |
| `POST /privacy/exports`、`GET /privacy/exports/{id}` | 请求/查询云端导出 | 独立于本地 CSV；需要重新认证，下载短期有效。 |
| `POST /account/deletion-challenges`、`POST /account/deletions` | 账户删除高风险流程 | 重新认证、明确确认、冷静期/撤销策略待确认；完整审计。 |

### 6.3 关键 JSON 示例

追加取出事件：

```json
{
  "id": "0190...",
  "clientMutationId": "harmony-install-1:2048",
  "deviceId": "0190...",
  "assetId": "0190...",
  "action": "take",
  "cigarettes": 1,
  "effectiveAt": "2026-07-14T12:05:09+08:00",
  "localDate": "2026-07-14",
  "timezoneOffsetMinutes": 480,
  "scene": "工作间隙",
  "note": "",
  "tarMgSnapshot": "10.00",
  "costFen": 300,
  "healthMinutes": 20,
  "modelVersion": "quit-risk-1"
}
```

返回事件必须关联原事件：

```json
{
  "id": "0191...",
  "clientMutationId": "harmony-install-1:2049",
  "assetId": "0190...",
  "action": "return",
  "cigarettes": 1,
  "reversesEventId": "0190...",
  "effectiveAt": "2026-07-14T12:06:10+08:00",
  "localDate": "2026-07-14",
  "timezoneOffsetMinutes": 480,
  "modelVersion": "quit-risk-1"
}
```

同步 push 响应：

```json
{
  "serverTime": "2026-07-14T04:06:11.421Z",
  "results": [
    { "clientMutationId": "harmony-install-1:2048", "status": "applied", "changeSeq": 4201, "stockRevision": 12 },
    {
      "clientMutationId": "harmony-install-1:2049",
      "status": "conflict",
      "error": { "code": "LEDGER_RETURN_TARGET_ALREADY_REVERSED", "retryable": false }
    }
  ],
  "nextCursor": "eyJzZXEiOjQyMDF9"
}
```

## 7. 本地优先同步设计

### 7.1 客户端原则

客户端先在本地事务中更新库存与账本，立即完成用户操作，再异步写入 outbox。无网络、token 过期、服务端 5xx 或同步冲突都不得回滚用户刚完成的本地记录，也不得阻塞下一次本地记账。UI 可显示“待同步/需处理”，不能伪装已云端确认。

### 7.2 服务端 push

1. 校验认证用户、设备、批量大小、DTO 和请求体哈希。
2. 先以领域对象 ID 和 `(userId, deviceId, clientMutationId)` 做永久去重，再用 idempotency response cache 快速返回原响应；缓存过期后仍不得重复应用事件。重复同键不同内容返回 `IDEMPOTENCY_KEY_REUSED`。
3. 对依赖缺失的乱序事件返回 `pending_dependency`，允许客户端后续重试；也可在短保留窗口内存入 inbox，但不得当作已应用账本。
4. 同一显式依赖链（例如 take→return）在批次内先拓扑排序并作为一个依赖组处理；组内使用同一短事务。互不依赖的 mutation 分别提交，允许逐项成功/失败。
5. 在短事务内锁定相关资产/原事件，验证库存、返回关联、用户归属与模型版本，追加事件，更新物化库存/`stock_revision`，写 change log。
6. 逐项返回 applied/duplicate/conflict/pending_dependency/rejected；批量 HTTP 成功不代表每一项成功。事务遇到序列化失败或死锁只做有限次数、带抖动重试，耗尽后返回可重试错误。

### 7.3 pull 与 bootstrap

- `pull` 按用户私有 `change_log.seq` 严格递增返回。客户端只有在整页落地成功后才提交新游标。
- 删除返回 tombstone `{entityType, entityId, deletedAt, version}`；客户端不得因列表缺失推断删除。
- 游标过期、数据代际变化或本地彻底重建时使用 `bootstrap`。首个 bootstrap 请求固定 `snapshotSeq = max(change_log.seq)` 并返回签名 snapshot token；后续分页始终携带该 token。
- bootstrap 页面只返回 `last_change_seq/change_seq <= snapshotSeq` 的 canonical 资源并使用稳定 keyset cursor。若某资源在水位后被修改而从快照页中跳过，该修改必须作为 `seq > snapshotSeq` 的完整 canonical change 在随后的 pull 中到达。这样无需跨多个 HTTP 请求保持长事务。
- 完成全部 bootstrap 页面后，客户端从 `snapshotSeq` 开始 pull；服务端必须在实体更新、`last_change_seq` 和 change log 写入之间保持同一事务，避免快照与增量间隙。
- `serverTime` 仅用于诊断与时钟偏差提示，不能覆盖事件 `effectiveAt`。

### 7.4 冲突策略

- **不可变账本**：绝不使用最后写入覆盖。重复事件去重；return 根据 `reversesEventId` 唯一应用；多设备超卖、重复返回或依赖缺失产生显式冲突。客户端保留本地事件并提示同步处理，不能静默删除历史。
- **资产/目标/设置等可变资料**：默认使用乐观并发。资产资料使用 `baseProfileVersion`，库存以账本/`stockRevision` 收敛；目标与设置使用 `baseVersion`。无重叠字段可做受控字段级合并；同字段冲突返回 canonical 值与版本，由客户端重试或用户选择。避免依赖不可信客户端时间做盲目 LWW。
- **默认资产唯一性**：服务器事务中以用户维度串行化；若多个设备同时切换，先提交者成功，后提交者收到版本冲突和当前默认项。客户端拉取后统一显示，资产顺序不因默认项改变。
- **离线乱序**：事件 ID 与显式依赖决定顺序，不用到达时间冒充行为时间。可在同一 push 批量内做拓扑排序；跨批依赖暂存或返回待依赖。

## 8. 公式、模型与 Harmony 差异

服务端只有在需要验证快照、生成跨设备一致视图或云端导出时才计算指标；客户端仍可本地即时计算。模型发布流程必须创建新的 `model_versions` 记录，历史事件继续引用旧版本。

已确认公式：

- `todayPackYearIncrement = todayCigarettes / 20 / 365`
- `healthMinutes = cigarettes * 20`
- `stockPotentialPackYears = stockCount / 20 / 365`
- `stockHealthDebtMinutes = stockCount * 20`
- `netHealth = clamp(100 - lungScore, 0, 100)`
- `dailyHarmScore` 仅代表当日行为风险，不等于长期健康净值。

当前差异与迁移建议：

| Harmony 已落地证据 | 服务端要求/迁移建议 |
| --- | --- |
| `LedgerEntry` 没有 `reversesEventId`，`returnLastSmoke()` 通过本地当日栈推断最近未返回 take。 | 上云前为历史 return 建立可验证关联；无法确定时标记 `legacyUnlinked`，不伪造关系。新事件必须显式关联。 |
| `RiskSnapshot` 没有 `modelVersion`。 | 首次迁移给当前已确认算法分配冻结版本，例如 `quit-risk-1`；未知旧快照标注 legacy，禁止假定为最新模型。 |
| `packPrice`、`cost` 是 JS `number`，以元表示。 | API 使用 `packPriceFen/costFen`；迁移时采用明确的十进制定点转换和舍入规则，输出差异报告。 |
| 时间是 epoch 毫秒，客户端按系统本地日判断。 | 上传转换为 ISO 8601，并携带 `localDate` 与 offset；原 epoch 可在迁移批次审计元数据保留。 |
| `retire` 一次清空全部资产，却把事件挂到默认资产并使用默认资产焦油。 | 服务端按资产拆分 retire 事件、共享 `batchId`；旧事件保留原貌并标记聚合语义。 |
| 当前 Preferences 把完整状态存为 JSON，真实云同步不存在。 | 首次启用同步必须显式征得同意并执行 bootstrap/push；不得扫描或上传未授权本地数据。 |
| 当前首页健康负债在最新同步报告中采用库存口径；`HomeSummary` 同时保留今日与库存负债。 | API 字段必须使用 `todayHealthDebtMinutes` / `stockHealthDebtMinutes` 等无歧义名称，不提供模糊 `healthDebt`。 |

## 9. 通知、重置与数据生命周期边界

- 严厉危害三连提醒和每日复盘是手机本地通知。首版后端不发送 push、不调度提醒、不因风险分数拒绝取烟。
- 通知权限未授权、发送失败或服务端不可用时，本地记录仍应成功。
- “重置本地数据”仅清理/恢复本机资产、账本、目标、设置和本地同步状态，不删除云端账户或云端数据。
- 云端导出、清除云数据、删除账户必须是独立高风险流程：重新认证、清晰影响说明、确认挑战、任务状态、审计、失败可恢复。冷静期和法定保留期由产品/法务确认。

## 10. 安全与隐私

- 数据最小化：只收同步必需的账户、设备、资产、账本、目标、设置；场景和备注按用户主动输入，不作广告画像。
- 认证：短期 access token、refresh token 轮换与撤销；密码使用 Argon2id 或等价强哈希。若采用短信/邮箱验证码，验证码短时有效、服务端只存 hash，并对发送/校验限流。供应商未确认。
- 加密：TLS 1.2+（优先 1.3）；数据库、备份和对象存储静态加密；密钥由受控 secret/KMS 管理并轮换。
- 授权：所有 repository/service 查询强制 `userId` 范围；对象 ID 不构成授权；跨用户访问测试为发布门禁。
- 日志：token、验证码、密码、完整备注、导出内容、连接串不得进入日志；用户/设备标识使用受控散列或最小必要 ID。
- 防护：登录/验证码/同步/导出/删除分别限流；设置 body/batch/note 长度上限；依赖锁定、SCA、SAST、容器扫描和 secret scan。
- 审计：认证安全事件、设备撤销、导出、删除、管理员动作写审计；普通读取不无限扩张审计数据。
- 备份恢复：加密备份、明确 RPO/RTO、定期恢复演练；删除策略必须覆盖备份中的到期清理或隔离恢复流程。

## 11. 可观测性、性能、容量与降级

### 11.1 建议 SLO（待运维确认）

- API 月可用性目标 99.9%，不包含计划维护；同步失败不会影响客户端本地记账。
- 常规读取/写入在服务端 p95 `< 300ms`，`push` 100 条事件 p95 `< 1s`；批量最大值先设 500，压测后调整。
- 错误率、认证失败率、同步冲突率、游标过期率、数据库池占用、慢查询、队列积压和删除任务时延均需指标与告警。

### 11.2 初始容量假设（不是事实）

以 10,000 DAU、每用户每天 20 个账本事件估算约 200,000 事件/日；按事件及索引 2–4KB 粗估 0.4–0.8GB/日原始增长。上线前必须用真实留存、事件量与备注长度修正，并制定分区/归档阈值。早期可按 `(user_id, effective_at)` 索引运行，达到慢查询或表规模阈值后再评估时间分区，避免过早复杂化。

### 11.3 故障降级

- 数据库不可用：readiness 失败、API 快速返回可重试错误；客户端继续本地 outbox，不丢记录。
- 日志/指标后端不可用：应用限量缓冲或丢弃非关键遥测，不阻塞领域事务。
- 云端导出/删除 worker 故障：任务保持可重试状态，用户可查询，不重复执行不可幂等步骤。
- 部分批量冲突：按项返回，禁止整批静默成功；重试只发送未确认项。

## 12. OpenAPI 与 Harmony 集成策略

1. Stage 0 先以 OpenAPI 3.0.3 创建 `openapi/backend-v1.yaml`，以 DTO、错误码、分页、同步 envelope 和示例为契约源。未来升级 3.1 必须单独 ADR，并验证 Nest 生成、lint 和 Harmony client 工具链。
2. CI 校验 OpenAPI 语法、breaking change 与实现一致性；发布版本保留不可变契约快照。
3. Harmony 侧从已发布契约生成或人工封装 ArkTS client；生成代码与 domain model 之间设 adapter，避免 API DTO 直接侵入 UI/ViewModel。
4. 在功能开关和用户明确同意前，不注册账户、不上传本地数据。启用同步后先注册 `clientInstanceId/deviceId`，执行 bootstrap，再上传 outbox。
5. Harmony 保持本地 repository 为主写路径；network sync 是后台协调器。每项记录保留 `syncState`、`clientMutationId`、重试信息与冲突状态。
6. 使用 contract fixture 验证金额分单位、ISO 时间、自然日、模型版本、墓碑、重复 push 和乱序依赖。

## 13. 风险、开放问题与 ADR

### 13.1 主要风险

- 多设备离线同时消费最后库存会产生超卖冲突；需显式冲突 UX，不能靠 LWW 掩盖。
- 当前 Harmony 历史数据缺少 return 关联、模型版本和精确金额，首次迁移需要兼容标记与对账。
- 账户认证、部署地区、数据保留和删除 SLA 未确定，可能影响 schema 与供应商。
- 模型算法被误解为医学结论；API 和文案必须持续带非医学诊断边界。
- Preferences 全量 JSON 规模增长可能在启用同步前成为客户端迁移风险。

### 13.2 待确认决策

- 账户方式：匿名账户升级、邮箱、短信还是第三方；是否允许无密码登录。
- PostgreSQL 17 或 18、Prisma 或 TypeORM、CI/部署平台、地区与高可用级别。
- 货币是否首期只支持 CNY；历史元金额转分的舍入策略。
- goal 的合法范围、资产删除语义、跨日 return 是否永远禁止或允许纠错流程。
- 云端导出格式、账户删除冷静期、法定保留期、备份 RPO/RTO。
- 同步冲突的产品呈现、游标保留期和单批大小。

### 13.3 建议 ADR 清单

- ADR-001：模块化单体与模块边界。
- ADR-002：Node/Nest/PostgreSQL 主版本与升级策略。
- ADR-003：Prisma vs TypeORM 与迁移所有权。
- ADR-004：本地优先同步、游标和 change log。
- ADR-005：不可变账本、return 关联和库存物化。
- ADR-006：金额、时间与自然日口径。
- ADR-007：认证与账户升级路径。
- ADR-008：模型版本、快照与历史兼容。
- ADR-009：隐私导出、删除、保留和备份恢复。
- ADR-010：资产 `profileVersion`/`stockRevision` 与默认资产锁策略。
- ADR-011：bootstrap 水位、`lastChangeSeq`、永久去重与依赖组事务。

下一步仅建议从 [后端实施计划的 Stage 0](./backend_implementation_plan.md#stage-0文档adr-openapi-草案与可行性) 开始；本轮不执行该阶段。

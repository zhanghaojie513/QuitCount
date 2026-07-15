# 戒烟有数后端分阶段实施计划

> 状态：执行记录，2026-07-15。Stage 0 已完成；Stage 1 工程、质量、OpenAPI diff、容器和 CI 配置已实现，本机因缺少 Docker CLI 未完成容器运行，远端 GitHub Actions 也未触发。数据库迁移和领域业务尚未开始。

## 1. 计划目标与边界

本计划把后端从契约草案推进到可选云同步服务。固定产品和工程规则见 [后端工程规则](./backend_rules.md)，架构、数据模型与 API 草案见 [后端技术设计](./backend_technical_design.md)。若三份文档重复或冲突，以产品规格与工程规则中的优先级为准。

状态标记：**【已确认事实】** 来自产品规格/Harmony 源码；**【建议选型】** 尚需 ADR 批准；**【待产品/运维确认】** 不得在实现中擅自决定。

### 1.1 MVP 强制边界

- Harmony 当前仍是本地优先，账户与同步仅占位；真实云同步不属于手机端首版已完成能力。
- 后端可先完成契约、基础设施、认证和领域 API，但手机核心 take/return/ledger 流程始终先本地成功，不等待网络。
- 用户未明确启用同步前不得上传既有本地数据；登录也不能成为首版核心流程前置条件。
- CSV 与通知仍由手机本地负责。首版后端不发严厉危害三连推送、不调度每日复盘、不阻止取烟。

### 1.2 阶段门禁

每阶段只在依赖满足后开始；完成实现、迁移、测试和验证后生成阶段报告，报告评审通过再进入下一阶段。不能以“编译通过”替代运行验证，也不能以“暂未验证”宣称完成。

报告统一路径：`docs/reports/backend_phase_xxx_report.md`。推荐文件名：

- `backend_phase_000_contract_report.md`
- `backend_phase_001_project_quality_report.md`
- `backend_phase_002_platform_foundation_report.md`
- `backend_phase_003_auth_account_report.md`
- `backend_phase_004_profile_domain_report.md`
- `backend_phase_005_ledger_report.md`
- `backend_phase_006_sync_report.md`
- `backend_phase_007_privacy_security_report.md`
- `backend_phase_008_integration_release_report.md`

## 2. 全阶段工作清单

- [x] Stage 0：文档、ADR、OpenAPI 草案和可行性（报告：[`backend_phase_000_contract_report.md`](./reports/backend_phase_000_contract_report.md)）。
- [ ] Stage 1：NestJS 工程与质量门禁（实现和本地门禁已完成；容器运行/优雅退出及远端 CI 待补验，报告：[`backend_phase_001_project_quality_report.md`](./reports/backend_phase_001_project_quality_report.md)）。
- [ ] Stage 2：配置、数据库、迁移、健康检查和日志。
- [ ] Stage 3：账户与认证，仍不强迫 Harmony 首版登录。
- [ ] Stage 4：资产、目标和设置 API。
- [ ] Stage 5：不可变账本、撤销和退役。
- [ ] Stage 6：离线同步 bootstrap/push/pull、幂等和冲突。
- [ ] Stage 7：隐私、导出/删除账户、审计和安全加固。
- [ ] Stage 8：Harmony 联调、压测、部署和发布。

## Stage 0：文档、ADR、OpenAPI 草案与可行性

### 目标与输入

- **目标**：冻结事实边界、术语、主要 API、错误码、模型与同步策略，先消除会导致返工的开放决策。
- **输入**：本三份后端文档；`QuitCountHarmony/docs/product_spec.md`；指定 Harmony 源码与 Phase 5/6/8 报告。
- **依赖**：无。已于 2026-07-15 完成 Stage 0 自动门禁；开放决策按 ADR 的后续阶段截止点继续跟踪。

### 实现内容与文件范围

- [x] 建立 `docs/adr/`，完成 ADR-001 至 ADR-011 的状态、责任角色和截止门禁。
- [x] 创建 `openapi/backend-v1.yaml`，覆盖认证、设备、资产、账本、目标、设置、sync、privacy。
- [x] 建立错误码目录、字段词汇表、金额/时间/自然日/模型版本约定。
- [x] 固定首期 OpenAPI 3.0.3；若业务要求 3.1，先以 ADR 验证 Nest 生成、lint、breaking diff 与 Harmony client 工具链。
- [x] 用 Harmony fixtures 演示 take、return、retire、重复 push、乱序依赖、默认资产冲突、墓碑和游标过期。
- [x] 完成 ADR-010（资产双版本与默认资产用户行锁）和 ADR-011（bootstrap 水位、永久事件去重与依赖组事务）。
- [x] 完成威胁建模与数据分类，确认只有在用户明确授权同步后才可上传 P3/P4 本地数据。
- [x] 决定 Node 24/NestJS 11/PostgreSQL 18/Prisma/OpenAPI 3.0.3 基线；认证供应商、部署平台保持待确认且未被虚构。

建议范围：`docs/backend_*.md`、`docs/adr/*.md`、`openapi/backend-v1.yaml`、`openapi/examples/*.json`、`docs/error_catalog.md`。

### 数据库迁移

无。只产出候选 ERD/DDL 与迁移策略，不连接数据库、不生成真实 migration。

### 测试与验证命令

Stage 0 已建立并实际运行以下固定版本工具链：

```powershell
npm run docs:lint
npm run openapi:lint
npm run openapi:validate
npm run contract:examples
npm run stage0:verify
```

还需人工检查：所有 Harmony 字段都有映射；每个错误码有触发条件和客户端处理；文档内部链接有效；建议/事实/待确认标记一致。

### 完成定义、风险与回滚

- **完成定义（已达到）**：OpenAPI 3.0.3 lint 通过；8 个关键 JSON fixture 可校验；ADR-001 至 ADR-011 有明确状态；未决项有责任角色/截止门禁；规格—Harmony—API 差异表已形成；Stage 0 报告已生成。首份契约没有已发布基线，breaking diff 记为不适用；发布基线建立后成为强制门禁。
- **主要风险**：过早锁死认证或 ORM；历史 return 无法可靠关联；金额迁移舍入不明确。
- **回滚**：本阶段无运行状态；撤回未批准 ADR/OpenAPI 变更并恢复上一版文档。已发布契约不得直接改写，需新版本或兼容修订。

## Stage 1：NestJS 工程与质量门禁

### 目标与输入

- **目标**：建立最小可构建、可测试、可容器启动的 NestJS 11 工程，不实现领域业务。
- **输入**：Stage 0 已批准技术 ADR、OpenAPI 与质量脚本命名。
- **依赖**：原则上 Stage 0 完成。当前仅按用户明确指示提前建立无业务骨架；任何领域模块、数据库或对外契约实现仍须等待 Stage 0 门禁。

### 实现内容与文件范围

- [x] 使用 `mise` Node.js `24.16.0` + npm `11.13.0` 初始化 NestJS 11 TypeScript 工程，固定 lockfile、`.node-version`、`packageManager` 和 engines。
- [x] 验证当前核心运行包 `@nestjs/common`、`@nestjs/core`、`@nestjs/platform-express` 为 `11.1.28`；后续只使用 NestJS 11 支持且未废弃的 API。
- [x] 建立 `src/main.ts`、`src/app.module.ts`、`src/common/`、`src/config/`、`src/modules/`、`test/`；未加入领域业务。
- [x] 配置严格 TypeScript、ESLint、Prettier、单元/E2E、覆盖率阈值与统一 `precommit:verify`/`ci:verify` 门禁。
- [x] 增加非 root 多阶段 Dockerfile、`.dockerignore`、只读/降权 Compose 骨架和最小 GitHub Actions CI；本机静态校验通过，运行验证待 Docker 环境。
- [x] 建立 OpenAPI 3.0.3 bundle、Stage 0 baseline 和保守 breaking diff 脚本；不声称 Nest DTO 已实现业务契约。

建议范围：`package.json`、lockfile、`nest-cli.json`、`tsconfig*.json`、`eslint.config.*`、`src/` 骨架、`test/`、`Dockerfile`、`compose.yaml`、CI 配置。

### 数据库迁移

无；数据库容器可定义但 Stage 2 才接入 schema。

### 测试与验证命令

```powershell
npm ci
npm run ci:verify
npm run openapi:bundle
npm audit --audit-level=high --registry=https://registry.npmjs.org
docker build -t quit-count-api:stage1 .
docker run --rm --name quit-count-api -p 3000:3000 quit-count-api:stage1
```

### 完成定义、风险与回滚

- **完成定义（部分达到）**：干净 `npm ci`、本地 `ci:verify`、覆盖率、OpenAPI bundle/diff、依赖审计和构建全绿；容器配置静态证明非 root/只读/降权，并使用 NestJS 11 `enableShutdownHooks()`。本机没有 Docker CLI，尚未实际构建、启动和发送终止信号；远端 workflow 未触发，因此 Stage 1 保持未完成状态。
- **主要风险**：Node/依赖版本漂移、Windows 与 Linux 脚本差异、无意义覆盖率造假。
- **回滚**：移除 Stage 1 新工程文件或回退到最后绿色提交；无数据库/外部状态需要回滚。

## Stage 2：配置、数据库、迁移、健康检查与日志

### 目标与输入

- **目标**：提供可验证的运行基础，尚不开放账户或领域写 API。
- **输入**：数据库/ORM ADR、配置分类、可观测性与 SLO 草案。
- **依赖**：Stage 1 完成；可用的本地 PostgreSQL/容器环境。

### 实现内容与文件范围

- [ ] 实现启动配置校验、环境分层和 secret 注入边界；缺关键配置快速失败。
- [ ] 接入 PostgreSQL 与选定 ORM；连接池、事务 helper、migration 命令和 seed 边界明确。
- [ ] 首批只建平台表：`users` 最小骨架、`devices`、`model_versions`、`change_log`、`idempotency_records`、`audit_events`，或按 ADR 拆分为后续迁移。
- [ ] 实现 `/health/live`、`/health/ready`、结构化日志、request/correlation ID、全局错误 envelope 和 DTO validation。
- [ ] 配置指标与 trace 接口；日志先本地 JSON，外部平台待确认。

建议范围：`src/config/`、`src/database/`、`src/common/`、`src/modules/health/`、ORM schema/migrations、`test/integration/`、Compose PostgreSQL。

### 数据库迁移

- Migration `0001_platform_foundation`：扩展/枚举/基础表、索引、约束。
- migration 在空库、重复执行保护、前一版本升级、失败事务回滚上验证。
- 插入冻结的初始 `model_versions` 只能在算法 ADR 批准后执行；否则保留空表。

### 测试与验证命令

```powershell
docker compose up -d postgres
npm run db:migrate
npm run db:migrate:status
npm run test:integration
npm run test:e2e
npm run build
npm run start:prod
```

人工验证 liveness 在进程活着时成功；数据库断开时 readiness 失败但不泄露连接信息；日志不含 secret。

### 完成定义、风险与回滚

- **完成定义**：迁移 smoke 通过；健康检查行为正确；日志含 requestId 且脱敏；数据库不可用时快速降级；生成 Stage 2 报告。
- **主要风险**：ORM 不能表达部分索引/约束、迁移锁表、健康检查误报。
- **回滚**：应用回退到 Stage 1；仅在无数据环境 down migration。共享环境优先兼容 migration/roll-forward，备份后操作。

## Stage 3：账户与认证（不强迫 Harmony 登录）

### 目标与输入

- **目标**：提供可选账户、会话和设备安全基础，保持匿名本地模式。
- **输入**：认证 ADR、威胁模型、供应商/凭证选择、令牌 TTL 与撤销策略。
- **依赖**：Stage 2 完成；认证方式得到产品与安全确认。若供应商未确认，可只实现 provider-neutral domain 与测试替身，不接真实发送。

### 实现内容与文件范围

- [ ] 实现注册/登录/refresh/logout、重新认证 challenge、refresh token 轮换和重用检测。
- [ ] 实现设备注册、列表、撤销；设备撤销联动 session。
- [ ] Guard 从 token 得到用户，不信任客户端自报 `userId`。
- [ ] 登录、验证码、refresh、设备注册分别限流和审计。
- [ ] 明确匿名本地用户升级为云账户的 UX/数据绑定契约；不自动上传历史数据。

建议范围：`src/modules/auth/`、`account/`、`users/`、`devices/`、认证 Guard/strategy、E2E fixtures。

### 数据库迁移

- Migration `0002_auth_account`：`auth_identities`、`refresh_sessions`、用户状态与必要唯一索引。
- 密码/验证码/token 只存 hash；迁移和 seed 不含真实凭证。

### 测试与验证命令

```powershell
npm run db:migrate
npm run test:unit -- auth
npm run test:integration -- auth
npm run test:e2e -- auth-account
npm run test:security -- auth
```

### 完成定义、风险与回滚

- **完成定义**：正常/过期/撤销/重放/限流路径通过；跨用户设备访问拒绝；未登录客户端仍可完全本地使用；真实供应商若未接入则明确未验证；生成 Stage 3 报告。
- **主要风险**：供应商锁定、账户枚举、token 泄漏、匿名数据误绑定。
- **回滚**：功能开关关闭注册/登录入口并撤销受影响 session；保留兼容表，不用破坏性 down migration。

## Stage 4：资产、目标与设置 API

### 目标与输入

- **目标**：实现可变领域资料及并发控制，为账本和同步准备 canonical 模型。
- **输入**：产品资产表单范围、默认资产规则、goal/settings OpenAPI、金额/时间 ADR。
- **依赖**：Stage 3 认证与 Stage 2 数据层完成。

### 实现内容与文件范围

- [ ] 实现 assets CRUD/软删除和 `PUT /assets/{id}/default` 原子切换。
- [ ] 拆分 `profileVersion` 与 `stockRevision`：资料和默认项只推进前者，库存账本投影只推进后者。
- [ ] 默认资产切换锁定用户父行，再清旧默认、设新默认、写 change log；唯一冲突、序列化失败和死锁采用有限重试。
- [ ] 服务端复验品牌、焦油、尼古丁、库存、价格；API 使用 `packPriceFen` 与 currency。
- [ ] 实现 goals/current、settings，并用 `version`/`If-Match` 处理并发。
- [ ] `localFirstEnabled` 作为固定承诺，不提供可关闭云端开关；通知权限/本地 reminder ID 不进入 API。
- [ ] 所有变更写 change log；软删除产生 tombstone。

建议范围：`src/modules/assets/`、`goals/`、`settings/`、领域 DTO/mapper、数据库 repository、OpenAPI/contract fixtures。

### 数据库迁移

- Migration `0003_profile_domain`：`assets`、`goals`、`user_settings`、部分唯一默认资产索引、check constraints、`profile_version`、`stock_revision`、`last_change_seq`。
- 迁移测试应构造并发默认切换与非法金额/库存，证明数据库兜底生效。

### 测试与验证命令

```powershell
npm run db:migrate
npm run test:unit -- assets goals settings
npm run test:integration -- profile-domain
npm run test:e2e -- assets-goals-settings
npm run openapi:check
```

### 完成定义、风险与回滚

- **完成定义**：边界校验、IDOR、幂等、资料版本冲突、库存修订隔离、用户行锁、唯一默认、软删除/墓碑测试通过；take 不会制造资料伪冲突；金额无 float；生成 Stage 4 报告。
- **主要风险**：并发下短暂无默认项、旧客户端单位误解、资产删除破坏历史。
- **回滚**：关闭领域 API 功能开关；应用回退时保留新增表/字段。数据修复使用审计 migration，不直接手工改生产数据。

## Stage 5：不可变账本与撤销/退役

### 目标与输入

- **目标**：建立 take/return/retire 追加式账本和事务性库存，冻结模型快照口径。
- **输入**：账本 ADR、公式/模型版本 ADR、Harmony 差异迁移规则。
- **依赖**：Stage 4 资产存在；初始模型版本已批准。

### 实现内容与文件范围

- [ ] 实现 `POST/GET /ledger-events`，禁止 PATCH/DELETE。
- [ ] 账本事件永久唯一约束覆盖事件 ID 与 `(userId, deviceId, clientMutationId)`；响应缓存过期后仍能识别重复事件。
- [ ] take：追加事件、扣物化库存、写风险快照/change log 同事务。
- [ ] return：强制 `reversesEventId`，使用原 take 的 tar/cost/health 快照，防重复返回与负数。
- [ ] retire：每资产事件 + `batchId`；不再把全部资产聚合到默认资产。
- [ ] 保存 `effectiveAt/receivedAt/localDate/timezoneOffsetMinutes/modelVersion`，验证 `netHealth` 公式。
- [ ] 设计 legacy import 校验器，但不在用户授权前读取/上传 Harmony 数据。

建议范围：`src/modules/ledger/`、`models/`、资产库存事务 service、导入 validator、OpenAPI examples。

### 数据库迁移

- Migration `0004_immutable_ledger`：`ledger_events`、`client_mutation_id`、`change_seq`、动作 enum/check、self-FK `reverses_event_id`、永久 mutation 唯一约束、唯一返回约束、查询索引、model FK。
- 通过数据库权限或 trigger/规则限制 UPDATE/DELETE；采用哪种方式由 ADR 确认并测试运维修复流程。

### 测试与验证命令

```powershell
npm run db:migrate
npm run test:unit -- ledger calculator
npm run test:integration -- ledger-transactions
npm run test:e2e -- ledger
npm run test:concurrency -- ledger
```

### 完成定义、风险与回滚

- **完成定义**：并发 take 不超卖；重复/双 return 不重复加库存；事务失败无半写；retire 多资产可追溯；历史模型不被回算；生成 Stage 5 报告。
- **主要风险**：锁竞争、客户端旧 return 无关联、模型参数争议、跨日 return 产品语义未定。
- **回滚**：关闭账本云写入口，客户端继续本地；数据库只做兼容扩展。已接受事件不得通过回滚删除，错误用补偿事件/roll-forward 修正。

## Stage 6：离线同步、幂等与冲突

### 目标与输入

- **目标**：在不改变本地先写前提下，实现 bootstrap/push/pull 和多设备收敛。
- **输入**：同步 ADR、OpenAPI fixtures、Harmony outbox/adapter 设计、支持的最大离线窗口。
- **依赖**：Stage 4/5 canonical 资源稳定；Harmony 联调分支可使用测试账户但不要求主流程登录。

### 实现内容与文件范围

- [ ] 实现设备级幂等记录、批量 push 逐项结果和请求体 hash 校验。
- [ ] 将有期限的 idempotency response cache 与永久领域去重分离，并验证缓存过期后的旧事件重放。
- [ ] 实现 change log、opaque cursor、分页 pull、cursor expired 和 tombstone。
- [ ] 实现带 `snapshotSeq`、签名 snapshot token、`lastChangeSeq/changeSeq` 过滤和稳定 keyset cursor 的可恢复 bootstrap；分页完成后从水位继续 pull。
- [ ] 同一批内对显式依赖链拓扑排序并按依赖组事务处理；互不依赖 mutation 保持逐项结果。
- [ ] 处理重复提交、乱序依赖、部分失败、离线重试、默认资产冲突、多设备库存冲突。
- [ ] 区分 immutable event 与 mutable profile；账本绝不 LWW。
- [ ] 定义客户端同步状态 applied/pending/conflict/rejected，服务端不可静默修正本地历史。

建议范围：`src/modules/sync/`、idempotency interceptor/store、change log publisher、cursor codec、批量 DTO、同步 E2E 场景。

### 数据库迁移

- Migration `0005_sync_protocol`：完善 `change_log` 完整 canonical payload、`sync_client_cursors`、`idempotency_records`/inbox 状态、snapshot token 元数据（若需持久化）、保留与清理索引。
- 用大批量与游标分页数据验证索引；清理 job 不能早于离线支持窗口删除 tombstone/幂等记录。

### 测试与验证命令

```powershell
npm run db:migrate
npm run test:unit -- sync
npm run test:integration -- sync
npm run test:e2e -- sync-offline-multidevice
npm run test:load -- sync
npm run contract:harmony
```

### 完成定义、风险与回滚

- **完成定义**：缓存有效或过期时重复 push 均无副作用；乱序依赖有稳定结果；依赖组不出现半写；bootstrap 多页与水位后 pull 无遗漏窗口；pull 不漏不重且游标可恢复；墓碑到达；多设备冲突不破坏账本/库存；断网不影响 Harmony 本地记账；生成 Stage 6 报告。
- **主要风险**：change log 与实体事务不一致、游标过早清理、冲突 UX 未准备、重试风暴。
- **回滚**：服务端关闭 sync feature flag，客户端保留 outbox 并退避；不清理已接受 canonical 数据。修复后从安全 cursor 继续或重新 bootstrap。

## Stage 7：隐私、导出/删除账户、审计与安全加固

### 目标与输入

- **目标**：使云端数据生命周期和安全控制达到预发布门禁。
- **输入**：法务/产品保留期、删除冷静期、导出范围、备份 RPO/RTO、安全基线。
- **依赖**：Stage 3–6 数据已可完整枚举与删除；对象存储/worker 若采用需由运维确认。

### 实现内容与文件范围

- [ ] 实现重新认证后的云端 export job、短期下载和过期清理；明确区别客户端本地 CSV。
- [ ] 实现 deletion challenge、删除任务、状态查询、撤销/冷静期（若批准）和备份隔离策略。
- [ ] 完成审计事件、日志脱敏、按用途限流、CORS/Helmet/body limit、secret 与 key 轮换流程。
- [ ] 执行 SAST、SCA、secret、容器扫描和依赖许可证检查。
- [ ] 建立备份、恢复、灾难演练和数据删除验证脚本。

建议范围：`src/modules/privacy/`、`data-lifecycle/`、`audit/`、worker/job、security config、runbooks、测试。

### 数据库迁移

- Migration `0006_privacy_security`：`data_lifecycle_jobs`、审计索引/保留字段、用户删除状态。
- 删除流程必须覆盖所有 user FK，使用受控顺序或级联策略；先在脱敏副本演练并生成行数对账。

### 测试与验证命令

```powershell
npm run db:migrate
npm run test:e2e -- privacy-lifecycle
npm run test:security
npm run audit:dependencies
npm run scan:secrets
npm run scan:image
npm run backup:restore:smoke
```

### 完成定义、风险与回滚

- **完成定义**：导出完整且跨用户隔离；删除需重新认证且可审计；删除/备份策略经审批；日志脱敏与安全扫描无未豁免高危项；恢复演练通过；生成 Stage 7 报告。
- **主要风险**：误删、备份残留、导出链接泄漏、审计反而收集过量数据。
- **回滚**：高风险 endpoint 默认 feature flag 关闭；任务状态可暂停/重试。真正删除一旦执行不可“回滚恢复给用户”，必须依赖预确认、冷静期和经过审批的恢复边界。

## Stage 8：Harmony 联调、压测、部署与发布

### 目标与输入

- **目标**：完成选择性同步联调、性能/故障验证、部署 runbook 和受控发布；手机本地模式仍可独立工作。
- **输入**：全部前序报告、已批准环境/域名/证书/监控、Harmony 联调构建、发布清单。
- **依赖**：Stage 0–7 完成；测试/预发布环境真实存在。当前这些环境均未确认。

### 实现内容与文件范围

- [ ] Harmony adapter 对照 OpenAPI，验证匿名本地、用户授权后首次 bootstrap、outbox push、pull、冲突和退出登录。
- [ ] 验证断网、慢网、401 refresh、429、5xx、数据库短故障、游标过期、重复安装/设备撤销。
- [ ] 对常规 API、100/500 项 push、长账本 pull/bootstrap 压测，验证连接池、索引和 SLO。
- [ ] 完成容器签名/SBOM（若平台支持）、migration job、灰度、监控告警、on-call、回滚 runbook。
- [ ] 用 feature flag 小流量启用账户/同步；不把未登录用户强制迁移。

建议范围：Harmony network/sync adapter（在 Harmony 项目另行授权后修改）、后端 contract fixtures、load tests、deployment manifests、runbooks、dashboards。

### 数据库迁移

原则上只允许经过 Stage 7 演练的兼容 migration。发布窗口禁止临时加入未经压测的大表重写。上线前执行 migration status、备份和校验；上线后执行行数/约束/慢查询检查。

### 测试与验证命令

以下为平台无关占位，具体命令由选定 CI/CD 与部署环境 ADR 替换：

```powershell
npm ci
npm run verify
npm run db:migrate:deploy
npm run test:e2e -- release
npm run test:load
npm run openapi:check
npm run image:smoke
```

### 完成定义、风险与回滚

- **完成定义**：Harmony 本地模式完全不依赖后端；授权同步全链路通过；性能/SLO/告警/备份恢复满足批准目标；灰度无阻断级问题；发布与回滚演练完成；生成 Stage 8 报告。
- **主要风险**：客户端真实设备行为与 fixture 不同、首次同步数据量高、schema/app 回滚不兼容、强制登录误上线。
- **回滚**：关闭注册/同步 feature flag，客户端继续本地并保留 outbox；应用回退到兼容版本；数据库优先 roll-forward。只有验证安全后才恢复同步。

## 3. 阶段报告模板

每阶段完成后创建 `docs/reports/backend_phase_xxx_report.md`，至少包含：

```markdown
# Backend Phase X 报告

## 阶段目标
## 完成内容
## 新增或修改文件
## API 验证
## 数据库与迁移验证
## 测试验证
## 验证命令与逐条结果
## 安全、隐私与可观测性验证
## 未验证项及原因
## 遗留问题与风险
## 回滚准备/演练结果
## 下一阶段注意事项
## 用户/评审确认状态
```

报告规则：

- 记录实际命令、退出码、关键结果和执行环境；不得只写“已通过”。
- API 列出新增/变更 endpoint、OpenAPI diff 和兼容性结论。
- 数据库列出 migration、耗时、锁影响、数据校验、回滚/roll-forward 结果。
- 未执行的设备、性能、安全或恢复验证必须明确原因与补验计划。
- 报告完成后暂停阶段推进，先解决阻断问题并完成评审。

## 4. 跨阶段依赖与决策时点

| 决策 | 最晚确认阶段 | 未确认时处理 |
| --- | --- | --- |
| Node/Nest/PostgreSQL/ORM、OpenAPI 3.0.3 基线 | Stage 0 | 已由 ADR-002/003 和 OpenAPI 草案确认；Stage 2 复核真实托管兼容性。 |
| 认证方式与供应商 | Stage 3 前 | 只做 provider-neutral 契约，不发送验证码。 |
| 金额币种与舍入 | Stage 4 前 | 不导入历史金额。 |
| 跨日 return、goal 范围 | Stage 5 前 | 契约标记未决，不实现猜测规则。 |
| 游标/tombstone/幂等保留期 | Stage 6 前 | 不启动清理 job。 |
| 删除冷静期、法定保留、RPO/RTO | Stage 7 前 | 高风险流程保持关闭。 |
| 域名、地区、CI/CD、部署平台、SLO | Stage 8 前 | 只在本地/临时测试环境验证，不宣称上线。 |

## 5. Stage 0 后的下一步（仅建议，不执行）

Stage 0 已完成，Stage 1 实现已落地。下一步仅补验 **Stage 1 运行门禁**：在可用 Docker 环境构建/启动非 root 镜像并验证终止信号，在实际仓库触发 CI workflow。补验通过并评审报告前不进入 Stage 2。

本轮不安装 Docker Desktop、不推送仓库、不触发外部 CI，也不进入 Stage 2。

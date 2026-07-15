# Backend Phase 000：契约与可行性报告

> 阶段：Stage 0；执行日期：2026-07-14 至 2026-07-15；状态：自动门禁通过，待项目责任角色评审 proposed ADR。

## 目标

建立后端事实边界、ADR、OpenAPI 3.0.3、错误码、字段口径、Harmony 映射、威胁模型和可重复验证脚本。不得创建数据库、云资源或业务实现，也不得改变 Harmony 本地优先行为。

## 完成内容

- 建立 ADR-001 至 ADR-011；9 项 accepted，ADR-007/009 因认证供应商与隐私/运维参数未确认保持 proposed，并给出责任角色和截止门禁。
- 接受 Node.js 24.16.0、NestJS 11、PostgreSQL 18 当前安全 minor、Prisma + 受审 SQL migration、OpenAPI 3.0.3 基线。
- 建立 20 条 path、29 个 operation、38 个 schema 的 OpenAPI 草案，覆盖 health/auth/users/devices/assets/ledger/goals/settings/sync/privacy。
- 建立 8 个 Harmony/同步 fixture，覆盖 take、return、retire、重复 push、乱序依赖、默认资产冲突、墓碑、游标过期。
- 建立错误码目录、字段词汇表、Harmony 差异与迁移建议、STRIDE 威胁模型和数据分类。
- 增加 Markdown/ADR、OpenAPI、Redocly 和 fixture 自动门禁。

## 修改文件

- `docs/adr/README.md`、`docs/adr/ADR-001-*.md` 至 `ADR-011-*.md`
- `docs/api_field_glossary.md`
- `docs/error_catalog.md`
- `docs/harmony_api_mapping.md`
- `docs/security_threat_model.md`
- `openapi/backend-v1.yaml`
- `openapi/examples/*.json`、`openapi/examples/README.md`
- `scripts/validate-docs.mjs`
- `scripts/validate-openapi.mjs`
- `scripts/validate-contract-examples.mjs`
- `redocly.yaml`、`package.json`、`package-lock.json`
- 三份 `docs/backend_*.md` 状态同步

## API 验证

- OpenAPI 版本：3.0.3；API 草案版本：`0.1.0-draft`；本地占位 server：`http://localhost:3000/api/v1`。
- `openapi:validate`：20 paths、29 operations、38 schemas，内部 `$ref`、金额整数、资产双版本、return、modelVersion、netHealth 公式、墓碑和同步状态检查通过。
- Redocly CLI `2.39.0`：规范 lint 通过，0 error。
- Breaking diff：不适用。本阶段是首份未发布契约，没有已发布基线；首次发布快照建立后，任何后续变更必须执行 breaking diff。

## 数据库与迁移验证

未创建数据库、未连接 PostgreSQL、未生成或执行 migration，符合 Stage 0 边界。PostgreSQL 18/Prisma 只是已接受架构基线，真实托管和 migration smoke 属于 Stage 2。

## 测试验证

- 20 份 Markdown 的内部文件/标题链接和陈旧状态检查通过。
- ADR-001 至 ADR-011 文件唯一、状态和责任角色完整。
- 8 个 JSON fixture 均可解析，关键动作/关联/错误码/墓碑不变量通过。

## 验证命令与逐条结果

执行环境：Windows PowerShell；`mise` Node.js 24.16.0；npm 11.13.0。

```text
rtk mise exec node@24 -- npm.cmd run stage0:verify
exit code: 0
docs:lint ok (20 markdown files, 11 ADRs)
openapi:validate ok (20 paths, 29 operations, 38 schemas)
redocly lint: valid
contract:examples ok (8 JSON fixtures)
```

安装并锁定的契约工具：`@redocly/cli@2.39.0`、`yaml@2.9.0`。npm 输出了用户级 `.npmrc` 中旧 Electron mirror/home/disturl 配置将来不受支持的警告；这不是 NestJS 11 废弃 API，也未影响本阶段退出码。未在本阶段擅自修改用户级配置。

## 安全、隐私与可观测性验证

- 数据分类明确 P3 行为数据和 P4 note/scene 只有在版本化授权后才能同步。
- token/验证码/密码/完整自由文本和导出正文被列入日志禁止字段。
- IDOR、幂等重放、cursor 篡改、导出/删除重新认证和备份数据复活风险已有后续测试门禁。
- 本阶段仅文档审查，没有真实渗透、密钥、WAF、备份恢复或生产日志验证。

## 未验证项及原因

- 没有已发布 OpenAPI 基线，breaking diff 不适用。
- Harmony adapter 尚未实现，未做生成 client 或设备联调；属于 Stage 8。
- PostgreSQL 约束、事务和 migration 未实现；属于 Stage 2/5/6。
- 认证方式/供应商、token TTL/MFA 未确认；ADR-007 proposed，Stage 3 前必须接受。
- 部署地区、保留期、删除冷静期、RPO/RTO 未确认；ADR-009 proposed，Stage 7 前必须接受。
- goal 最终合法范围、历史金额舍入和跨日 return UX 仍需产品在相应阶段确认。

## 遗留问题与风险

- 多设备离线消耗最后库存仍需要明确客户端冲突 UX。
- Harmony 旧账本缺少 return 关联、时区和 modelVersion，首次迁移必须输出 legacy/unresolved 报告。
- OpenAPI `SyncMutation.payload` 当前为按 `kind` 说明的开放对象；Stage 6 前应收紧为明确 discriminator/oneOf DTO，避免客户端生成弱类型。
- 当前认证 DTO 是 provider-neutral 草案，不能视为真实登录方案。

## 回滚准备/演练结果

本阶段无数据库、云资源或外部状态。回滚只需恢复文档、契约、脚本和开发依赖；未执行破坏性操作。已发布后的契约不得直接覆盖，本草案尚未发布。

## 下一阶段注意事项

Stage 1 只补齐容器、CI、覆盖率与 OpenAPI 实现一致性骨架；不得提前实现领域 API。所有 NestJS 代码必须使用 NestJS 11 支持且未废弃的 API。

## 用户/评审确认状态

- 用户已指示开始实施 Stage 0，并明确要求 NestJS 11 禁止废弃 API。
- 自动门禁已通过。
- ADR-007、ADR-009 和各待产品/运维决策仍需相应责任角色在截止门禁前确认；本报告不把它们伪装为已批准供应商或 SLA。

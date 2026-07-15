# Stage 0 威胁模型与数据分类

> 状态：Stage 0 基线，2026-07-15。部署地区、身份供应商、保留期和 RPO/RTO 仍待责任角色确认；本文不虚构现有云资源。

## 1. 范围与信任边界

```text
Harmony 本地仓库/outbox
        │ TLS + access token + device identity
        ▼
API 边界（认证、DTO 校验、限流、requestId）
        │ application service / transaction
        ▼
PostgreSQL（用户域数据、账本、change log、审计）
        │ 受控异步任务
        ├── 导出对象存储【待选型】
        └── 备份系统【待选型】
```

手机本地存储、网络、API、数据库、导出/备份和运维人员是不同信任域。Harmony UI 传入的 `userId`、资源 ID、时间、版本和金额都不可信；服务端必须从认证主体恢复用户范围并重新验证。

## 2. 数据分类与上传授权

| 级别 | 数据示例 | 是否可上传 | 主要控制 |
| --- | --- | --- | --- |
| P0 公开/技术 | API 版本、公开模型说明 | 可 | 完整性、缓存控制 |
| P1 内部技术 | requestId、无用户含义的指标、构建版本 | 可 | 最小日志、访问控制 |
| P2 账户/设备 | 账户标识、设备别名、会话、IP/UA 审计 | 仅启用账户所需 | token hash、限流、最短保留、脱敏 |
| P3 行为健康相关 | 资产、take/return/retire、焦油/尼古丁、目标、风险快照 | **仅用户明确启用同步后** | 用户隔离、加密、导出/删除、审计 |
| P4 自由文本/凭证 | `scene`、`note`、密码、验证码、token | note/scene 仅授权同步；凭证绝不明文持久化/记录 | 长度限制、日志排除、hash/轮换、严格访问 |

本地 CSV 文件、通知内容、系统通知权限和未授权的本地历史不得由后端主动扫描或上传。`syncEnabled=true` 的旧本地布尔值不能单独充当数据处理同意；首次同步需要版本化 consent 记录。

## 3. STRIDE 风险与控制

| 类别 | 典型威胁 | Stage 0 设计控制 | 后续验证 |
| --- | --- | --- | --- |
| Spoofing | token 盗用、伪造 deviceId | 短 access token、refresh 轮换/hash、设备撤销、重新认证 | Stage 3 会话重放/撤销测试 |
| Tampering | 修改金额/库存/版本、篡改 cursor | DTO 白名单、账本驱动库存、payload hash、签名 opaque cursor | Stage 5/6 并发与篡改测试 |
| Repudiation | 否认导出/删除/设备撤销 | requestId、最小审计、服务端时间、主体与设备关联 | Stage 7 审计完整性测试 |
| Information disclosure | IDOR、日志泄露、导出链接泄露 | 所有查询按认证 userId；日志排除敏感字段；短期单次导出链接 | 跨用户 E2E、日志扫描 |
| Denial of service | 登录轰炸、巨大 push、深分页 | 按身份/IP/设备限流；批量/字段长度上限；cursor 分页 | Stage 7/8 压测和限流测试 |
| Elevation of privilege | 普通用户调用管理员/他人资源 | deny-by-default Guard、资源归属查询、最小 DB 权限 | 权限矩阵、IDOR 测试 |

## 4. 高风险流程

- 账户删除、云端清除、导出、设备撤销、凭证恢复必须重新认证并审计。
- “重置本地数据”只影响手机本地；不得复用云端删除 endpoint。
- 同一 `clientMutationId` 不得二次扣库存；同键异 payload 作为篡改/客户端错误冲突处理。
- 账本不可用 LWW；冲突不能静默删除客户端离线记录。
- 备份恢复后必须重放删除标记，防止已删除账户复活。

## 5. 日志与可观测性允许字段

允许：`requestId`、route template、status、latency、匿名化 actor/device surrogate、错误 `code`、批次数量、冲突计数。

禁止：密码、验证码、access/refresh token、cookie、Authorization、连接串、完整 note/scene、CSV/导出正文、删除载荷、完整邮箱/手机号、原始 cursor。

## 6. 待确认项

| 决策 | 责任角色 | 截止门禁 |
| --- | --- | --- |
| 登录方式、身份供应商、token TTL/MFA | 产品负责人、安全负责人 | Stage 3 前 |
| 部署地区、密钥/secret manager、WAF/限流设施 | 运维负责人、安全负责人 | Stage 2/7 前 |
| 数据/审计/tombstone/备份保留期 | 隐私/法务、运维负责人 | Stage 7 前 |
| 导出对象存储、链接有效期、删除 SLA | 隐私/法务、产品负责人 | Stage 7 前 |
| RPO/RTO、恢复演练周期 | 运维负责人 | 上线前 |


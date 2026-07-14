# API 字段与口径词汇表

> 本文是 [OpenAPI 草案](../openapi/backend-v1.yaml) 的中文解释；机器契约以 OpenAPI 为准，产品规则以 Harmony `product_spec.md` 为准。

## 通用字段

| 字段 | 类型/格式 | 口径 |
| --- | --- | --- |
| `id` | UUID string | 服务端 canonical ID；不得包含用户可识别信息。 |
| `clientMutationId` | string, 1–64 | 设备生成且重试稳定；与 user/device 组成永久去重键。 |
| `deviceId` | UUID string | 已注册客户端实例，不使用硬件序列号。 |
| `version` | positive integer | 目标/设置等可变资料乐观锁版本。 |
| `profileVersion` | positive integer | 资产资料/默认项版本。 |
| `stockRevision` | non-negative integer | 仅账本事务推进的库存版本。 |
| `occurredAt` | ISO 8601 date-time | 用户行为发生时间，必须带 `Z` 或 offset。 |
| `serverReceivedAt` | ISO 8601 date-time | 服务端接收时间，只用于审计/稳定排序。 |
| `localDate` | `YYYY-MM-DD` | 客户端行为发生地的本地自然日。 |
| `timezoneOffsetMinutes` | -840..840 integer | 行为发生时 UTC offset；不能单独替代 IANA timezone。 |
| `cursor` | opaque string | 用户/查询隔离，不解析、不自行构造。 |
| `modelVersion` | string | 风险公式版本，如 `quit-risk/1.0.0`。 |
| `deletedAt` | ISO 8601/null | 软删除时间；pull 以 tombstone 传播。 |

## 金额与计量

- `packPriceFen`、`unitCostFen`、`costFen` 均为整数分，首期货币 `CNY`；禁止浮点金额。
- `tarMg`、`nicotineMg` 在 API 以 decimal string 表达，避免跨语言二进制浮点差异；数据库用受限 `numeric`。
- `cigarettes` 和 `stockCount` 为整数支数。
- take 成本为正、return 成本为对应 take 的相反数、retire 默认成本为 0，均以事件快照为准。

## Harmony → API 映射

| Harmony 字段 | API 字段 | 迁移说明 |
| --- | --- | --- |
| `InventoryAsset.packPrice`（元 number） | `packPriceFen`（分 integer） | 必须按 ADR-006 的已批准舍入策略迁移并对账。 |
| `LedgerEntry.timestamp`（epoch ms） | `occurredAt` + `localDate` + offset | 旧记录若缺时区，需标 `legacyTimeAssumption`，不得伪造精度。 |
| `LedgerEntry.cost`（元 number） | `costFen` | 旧记录输出舍入差异；return 尽量关联原 take。 |
| `RiskSnapshot`（无版本） | `riskSnapshot.modelVersion` | 旧记录使用明确 legacy 版本，禁止冒充新算法。 |
| `isDefault` | `isDefault` + `profileVersion` | 服务端唯一索引和用户行锁保证至多一个。 |
| `syncEnabled` | 授权后的同步状态 | 本地 `true` 不能单独视为上传授权；首次启用需显式同意。 |

## 公式口径

- `todayPackYearIncrement = todayCigarettes / 20 / 365`
- `healthMinutes = cigarettes * 20`
- `stockPotentialPackYears = stockCount / 20 / 365`
- `stockHealthDebtMinutes = stockCount * 20`
- `netHealth = clamp(100 - lungScore, 0, 100)`，严禁使用 `100 - dailyHarmScore`。


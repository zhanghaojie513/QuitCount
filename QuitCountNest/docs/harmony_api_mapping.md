# Harmony 数据到后端契约映射与差异

> 权威顺序：`product_spec.md` > 当前 Harmony 源码 > 本后端草案。本文不修改 Harmony 项目。

## 1. 已有结构映射

| Harmony | 后端 DTO/资源 | 处理 |
| --- | --- | --- |
| `InventoryAsset` | `Asset` | `packPrice` 元转换为 `packPriceFen`；增加资料/库存版本、软删除和服务端时间。 |
| `LedgerEntry` | `LedgerEvent` | epoch ms 转 ISO；增加 `reversesEventId`、设备/幂等、localDate/offset、modelVersion。 |
| `GoalSettings` | `Goal` | 增加资源 ID、version 和更新时间；合法范围仍待产品确认。 |
| `AppSettings` | `Settings` | 只同步用户授权字段；本地通知调度字段仍由客户端执行。 |
| `RiskSnapshot` | `RiskSnapshot` | 增加 `modelVersion`；数值快照不随新模型重写。 |
| `QuitState` | bootstrap 资源集合 | 不直接上传整块 JSON；拆成版本化资源与不可变事件。 |

## 2. 规格与当前 Harmony 差异/迁移建议

| 差异 | 风险 | 建议 |
| --- | --- | --- |
| `RiskSnapshot` 没有 `modelVersion` | 算法升级破坏历史口径 | 旧记录标记 `quit-risk/harmony-legacy-1`，导入报告列出数量；不冒充新版本。 |
| `LedgerEntry` 没有 return 原 take 关联 | 重复 return/多设备无法可靠判断 | 新事件强制 `reversesEventId`；历史记录只在可唯一推断时关联，否则标记 legacy unresolved。 |
| 金额用 JS/ArkTS `number` 元 | 二进制浮点和舍入差异 | 后端整数分；首次迁移输出源值、结果和差异。 |
| 时间只有 epoch ms | 缺少原始本地日/时区语义 | 新事件保存 `occurredAt/localDate/timezoneOffsetMinutes`；旧记录记录时区假设。 |
| `syncEnabled` 只是占位布尔值 | 可能被误当作上传同意 | 首次云同步增加版本化 consent，不凭旧布尔值上传。 |
| repository 整体 JSON 覆盖 | 多设备会丢更新，账本可能被 LWW | 后端拆分可变资源和 append-only 事件，使用 change cursor。 |
| `cloneState` 在无默认项时选第一项 | 服务端并发下可能产生非显式选择 | 服务端由唯一索引保证；删除默认项时要求显式替代，规则待产品确认。 |
| 当前风险公式已正确使用 `100-lungScore` | 后端若重算错误会口径漂移 | 契约/fixture 固定该公式并带 modelVersion。 |

## 3. 同步启用流程

1. 用户继续匿名本地使用；不调用后端也不受影响。
2. 用户进入账户与同步，完成认证并查看上传范围。
3. 用户明确同意当前 consent 版本，注册无硬件标识的 `deviceId`。
4. 客户端执行 bootstrap，建立 canonical 映射和 pull cursor。
5. 客户端把本地记录转为稳定 `clientMutationId` 的 outbox，按依赖 push。
6. 冲突保留本地记录与状态；不得因服务端拒绝静默删除。

## 4. Stage 0 验收映射

- 资产范围：品牌 1–16 字、焦油 1–20mg、尼古丁 0.1–3mg、新增库存 1–200、整包价 1–200 元。
- 行为：take/return/retire；return 必须关联原 take；库存和净取出不为负。
- 通知：手机本地提醒，失败不影响记账，服务端不阻塞。
- 公式：`netHealth = clamp(100 - lungScore, 0, 100)`。
- 合规：非医学诊断，不给治疗建议、不羞辱、不做购买推荐。


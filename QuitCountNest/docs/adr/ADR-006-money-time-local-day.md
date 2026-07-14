# ADR-006：金额、时间和本地自然日口径

- 状态：accepted
- 日期：2026-07-14
- 责任角色：后端负责人、产品负责人
- 历史舍入确认：Stage 4 导入前

## 决策

- 首期 API 金额使用整数分，字段以 `Fen` 结尾；数据库使用 `bigint`/受限 `numeric`，禁止 float/double。
- 当前产品整包价为 1–200 元；API 用 `packPriceFen` 表示 100–20000 分。
- 单支成本在 take 时按已确认舍入策略计算并写入 `unitCostFen` 快照；return 写相反金额。
- 数据库存 UTC `timestamptz`，API 用带 `Z`/offset 的 ISO 8601。
- 行为本地自然日同时保存 `localDate`（`YYYY-MM-DD`）和 `timezoneOffsetMinutes`；未来需要 DST/跨区统计时增加 IANA timezone，不用服务端接收时间推断。
- 服务端写 `serverReceivedAt` 仅用于审计/排序，不覆盖 `occurredAt`。

## 待产品确认

Harmony 历史 `packPrice`/`cost` 为元数值，迁移到分时采用何种舍入规则需在 Stage 4 前确认。默认建议为 decimal 字符串解析后四舍五入到最近分，并输出对账报告；不得直接用二进制浮点乘 100 后静默截断。


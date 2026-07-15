# OpenAPI Stage 0 fixtures

这些 fixture 覆盖产品/同步关键路径：take、return、retire、重复提交、乱序依赖、默认资产冲突、墓碑和游标过期。

约束：

- 示例 ID 仅用于测试，不对应真实用户。
- 请求中的 `clientMutationId` 在重试时保持不变。
- return 必须通过 `reversesEventId` 关联原 take。
- 错误响应的 `code` 与 [错误码目录](../../docs/error_catalog.md) 一致。
- `npm run contract:examples` 必须验证全部 JSON 可解析和关键字段/不变量。


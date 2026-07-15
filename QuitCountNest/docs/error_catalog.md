# 后端错误码目录

> OpenAPI 响应统一为 `ErrorResponse`。错误 `code` 是稳定契约；中文 `message` 仅供展示/诊断，客户端不得按文案分支。

## 1. 统一格式

```json
{
  "code": "ASSET_PROFILE_VERSION_CONFLICT",
  "message": "资产资料已被其他设备更新",
  "requestId": "req_01JZ...",
  "retryable": false,
  "details": {
    "resourceId": "0190d1d4-4c45-7d28-a413-9f82e88f3271",
    "currentProfileVersion": 4
  }
}
```

`details` 只能返回客户端安全处理所需字段，禁止堆栈、SQL、内部路径、供应商原文或跨用户资源信息。

## 2. 通用/认证错误

| code | HTTP | 触发条件 | retryable | 客户端处理 |
| --- | ---: | --- | --- | --- |
| `VALIDATION_FAILED` | 400 | DTO、格式、范围或未知字段错误 | false | 保留表单并按字段提示 |
| `AUTH_REQUIRED` | 401 | 缺少/无效 access token | false | 尝试一次 refresh；失败回登录/本地模式 |
| `AUTH_SESSION_REVOKED` | 401 | refresh 已撤销或轮换重放 | false | 清除会话，保留未同步本地数据 |
| `AUTH_REAUTH_REQUIRED` | 401 | 高风险流程需重新认证 | false | 显示重新认证流程 |
| `FORBIDDEN` | 403 | 已认证但缺少操作权限 | false | 不重试，不泄露策略细节 |
| `RESOURCE_NOT_FOUND` | 404 | 不存在或无权访问 | false | 当作不可用；不推断他人资源 |
| `IDEMPOTENCY_KEY_REUSED` | 409 | 同 key 对应不同规范化请求 | false | 生成新操作前先调查本地错误 |
| `RATE_LIMITED` | 429 | 超出限流 | true | 遵循 `Retry-After`，指数退避 |
| `INTERNAL_ERROR` | 500 | 未分类服务端错误 | true | 保留本地数据，退避重试并带 requestId 报告 |
| `SERVICE_UNAVAILABLE` | 503 | 依赖/维护导致暂不可用 | true | 保持离线优先，稍后同步 |

## 3. 资产/资料错误

| code | HTTP | 触发条件 | retryable | 客户端处理 |
| --- | ---: | --- | --- | --- |
| `ASSET_PROFILE_VERSION_CONFLICT` | 409 | `baseProfileVersion` 过期 | false | 展示 canonical 值，用户选择合并/重试 |
| `ASSET_DEFAULT_CONFLICT` | 409 | 并发默认项切换或目标已删除 | false | 采用响应中的 canonical 默认项并 pull |
| `ASSET_DEFAULT_REQUIRED` | 422 | 操作会使需要默认项的账户无默认资产 | false | 要求用户选择替代资产 |
| `ASSET_REFERENCED_BY_LEDGER` | 409 | 尝试硬删已有账本引用的资产 | false | 改为软删除/归档 |
| `GOAL_VERSION_CONFLICT` | 409 | 目标 baseVersion 过期 | false | 合并或采用 canonical 版本 |
| `SETTINGS_VERSION_CONFLICT` | 409 | 设置 baseVersion 过期 | false | 合并或采用 canonical 版本 |

## 4. 账本错误

| code | HTTP | 触发条件 | retryable | 客户端处理 |
| --- | ---: | --- | --- | --- |
| `LEDGER_STOCK_CONFLICT` | 409 | take 时 canonical 库存不足/并发耗尽 | false | 保留本地冲突记录，刷新库存并提示 |
| `LEDGER_RETURN_TARGET_REQUIRED` | 422 | return 缺少 `reversesEventId` | false | 修复 outbox 关联 |
| `LEDGER_RETURN_TARGET_NOT_FOUND` | 409 | 原 take 不存在/不同用户或资产 | false | 标记人工处理，不猜测关联 |
| `LEDGER_RETURN_TARGET_ALREADY_REVERSED` | 409 | 原 take 可返数量已耗尽 | false | 标记重复/冲突并 pull |
| `LEDGER_DEPENDENCY_PENDING` | 409 | 依赖 mutation 尚未到达 | true | 保留 pending，先推上游后重试 |
| `LEDGER_DEPENDENCY_CYCLE` | 422 | 批次依赖图有环 | false | 修复本地 outbox 图 |
| `LEDGER_EVENT_IMMUTABLE` | 405 | 尝试修改/普通删除事件 | false | 使用补偿事件 |
| `LEDGER_MODEL_VERSION_UNSUPPORTED` | 422 | 客户端模型版本不可接受 | false | 升级客户端或走 legacy 导入流程 |

## 5. 同步错误

| code | HTTP | 触发条件 | retryable | 客户端处理 |
| --- | ---: | --- | --- | --- |
| `SYNC_NOT_ENABLED` | 403 | 用户未授权/未启用云同步 | false | 留在本地模式，重新发起同意流程 |
| `SYNC_DEVICE_NOT_REGISTERED` | 409 | deviceId 未绑定当前账户 | false | 注册设备后重试 |
| `SYNC_CURSOR_INVALID` | 400 | cursor 格式/签名/查询范围错误 | false | 丢弃该 cursor，重新 bootstrap |
| `SYNC_CURSOR_EXPIRED` | 410 | change/tombstone 保留窗口已过 | false | 完整 bootstrap，不静默继续 |
| `SYNC_BATCH_TOO_LARGE` | 413 | mutation 数量/字节超限 | false | 拆批并保持 mutation ID |
| `SYNC_SNAPSHOT_TOKEN_INVALID` | 400 | bootstrap token 被篡改或用于其他用户/段 | false | 重新 bootstrap |
| `SYNC_CONSENT_VERSION_REQUIRED` | 409 | 同意版本缺失/过期 | false | 展示更新后的同步授权 |

## 6. 隐私流程错误

| code | HTTP | 触发条件 | retryable | 客户端处理 |
| --- | ---: | --- | --- | --- |
| `PRIVACY_JOB_ALREADY_RUNNING` | 409 | 同类型导出/删除任务已存在 | false | 跳转现有任务状态 |
| `PRIVACY_EXPORT_EXPIRED` | 410 | 导出下载已过期 | false | 重新申请导出 |
| `ACCOUNT_DELETION_ALREADY_SCHEDULED` | 409 | 删除已排期 | false | 展示排期/取消能力 |
| `ACCOUNT_DELETION_NOT_CANCELLABLE` | 409 | 已进入不可取消阶段 | false | 展示支持渠道和状态 |

## 7. 维护规则

- 新错误码必须补充触发条件、HTTP、可重试性、客户端动作和 OpenAPI 示例。
- 已发布 `code` 不复用、不改语义；废弃需保持兼容窗口并在新 API 版本移除。
- 批量 sync 的业务冲突以 item result 返回；整个请求的认证、语法、大小等 envelope 错误才使用顶层错误。


# Backend Phase 001：工程与质量门禁报告

> 阶段：Stage 1；执行日期：2026-07-15；状态：实现与本地门禁通过，容器运行和远端 CI 未验证，阶段保持未完成。

## 目标

建立可重现、严格检查、可测试、可容器化的 NestJS 11 工程骨架，不实现领域业务，不创建数据库或云资源。

## 完成内容

- 固定 Node.js 24.16.0、npm 11.13.0、NestJS 11；TypeScript 开启 `strict`。
- 建立 `src/common`、`src/config`、`src/modules` 空骨架。
- 建立统一 `precommit:verify`/`ci:verify`：格式、lint、类型、文档/契约、breaking diff、容器/CI 静态检查、覆盖率、E2E、build。
- 覆盖率门禁：statements/lines/functions 80%，branches 75%；纯启动入口和 module wiring 排除，未来业务文件默认纳入。
- 建立 OpenAPI bundle 与 `openapi/baselines/backend-v1.stage0.yaml`，保守检查 path/operation/response/parameter/schema/property/required/enum/type/format 的破坏性变化。
- 建立 Node 24.16.0 多阶段 Dockerfile，生产依赖 prune，运行用户 `node`；Compose 使用只读文件系统、tmpfs、drop ALL capabilities、no-new-privileges 和健康检查。
- 使用 NestJS 11 官方支持的 `app.enableShutdownHooks()`；未使用废弃 API。
- 增加编译产物 runtime smoke：启动服务、验证 `GET /`、Windows 发送 `SIGINT`/Linux CI 发送 `SIGTERM` 并等待退出。
- 建立最小 GitHub Actions workflow；以本地同名 `npm run ci:verify` 为平台中立核心门禁。

## 修改文件

- `Dockerfile`、`.dockerignore`、`compose.yaml`
- `.github/workflows/ci.yml`
- `package.json`、`package-lock.json`、`tsconfig.json`、`.gitignore`
- `src/main.ts`、`src/common/.gitkeep`、`src/config/.gitkeep`、`src/modules/.gitkeep`
- `scripts/check-openapi-breaking.mjs`
- `scripts/validate-container-config.mjs`
- `scripts/validate-ci-config.mjs`
- `openapi/baselines/backend-v1.stage0.yaml`
- 本报告及实施计划/技术设计状态

## API 验证

- `openapi:bundle` 成功生成自包含 bundle（生成目录被忽略，不作为手工维护源）。
- `openapi:breaking` 与 Stage 0 baseline 比较通过。
- Stage 0 OpenAPI 仍为契约草案；本阶段没有创建 NestJS DTO/controller，不声称实现与契约一致。

## 数据库与迁移验证

未安装 Prisma、未连接 PostgreSQL、未创建 schema/migration，符合 Stage 1 边界。

## 测试验证

- 单元测试：1 suite / 1 test 通过。
- E2E：1 suite / 1 test 通过。
- 覆盖率：statements 100%、branches 75%、functions 100%、lines 100%，通过阈值。
- TypeScript strict、ESLint、Prettier、Nest build 全部通过。

## 验证命令与逐条结果

```text
rtk mise exec node@24 -- npm.cmd ci
exit 0；按 lockfile 重建 696 packages

rtk mise exec node@24 -- npm.cmd run ci:verify
exit 0；format/lint/typecheck/Stage 0/OpenAPI diff/container lint/CI lint/unit/E2E/build/runtime smoke 全绿

rtk mise exec node@24 -- npm.cmd run openapi:bundle
exit 0；bundle 生成成功

rtk mise exec node@24 -- npm.cmd audit --audit-level=high --registry=https://registry.npmjs.org
exit 0；found 0 vulnerabilities（含 dev dependencies）

rtk docker version
失败；本机 PATH 没有 docker binary
```

## 安全、隐私与可观测性验证

- Docker/Compose 静态门禁验证多阶段、非 root、只读、最小 capability、禁止提权和健康检查。
- `npm audit` 使用 npm 官方 registry 验证全部依赖 0 已知漏洞。
- GitHub workflow 默认 `contents: read`，任务有超时和并发取消。
- 没有 secrets、数据库凭证、域名或真实环境配置进入仓库。

### 第三方 deprecated 警告登记

| 警告 | 来源 | 运行时影响 | 处理计划 |
| --- | --- | --- | --- |
| `inflight@1.0.6`、`glob@7.2.3` | Jest 30 → Istanbul/test-exclude 的传递 dev 依赖 | 不进入 `npm prune --omit=dev` 后的生产镜像；项目源码未调用 | 跟随 Jest/Istanbul 上游升级；Stage 7 前复核，若出现安全公告立即提前处理 |
| `glob@10.5.0` | Jest 30 内部传递 dev 依赖 | 同上；完整 npm audit 当前为 0 | 跟随 Jest 上游；每次依赖升级和 CI audit 复核 |
| 用户 `.npmrc` 的 `home/disturl/Electron mirror` | 用户级 npm 配置，不属于项目 | 不影响 NestJS 11 API或仓库构建结果，但未来 npm 主版本可能拒绝 | 不擅自修改用户配置；由用户在升级 npm 前清理 |

`@nestjs/cli` 当前解析到 `glob@13.0.6`，上述旧 glob 警告来自 Jest 工具链，不是 NestJS 11 源码废弃 API。

## 未验证项及原因

- Docker image 未构建/启动：本机未安装 Docker CLI。
- 容器实际 UID、只读文件系统、健康检查和镜像体积未运行验证。
- SIGTERM 优雅关闭未在 Linux 容器验证；代码已按 NestJS 11 官方方式启用 shutdown hooks，Windows 对 SIGTERM 有平台限制。
- GitHub Actions workflow 尚待本次独立 `codex/` 分支推送后运行；workflow 已包含 image build、非 root、只读/降权启动、HTTP 探针、Linux `SIGTERM` 和 exit code 验证。
- Actions 当前使用官方版本 tag，生产前应结合仓库安全策略决定是否 pin commit SHA。

## 遗留问题与风险

- Stage 1 不能标记完成，也不能进入 Stage 2，直到容器和远端 CI 门禁补验。
- 当前 `/` 仅为 Nest 默认 smoke endpoint；Stage 2 才实现正式 health/readiness、配置和日志。
- 覆盖率基数很小；领域代码加入后必须维持阈值，不能继续靠骨架的 100% 指标解释质量。

## 回滚准备/演练结果

没有数据库或外部状态。可回滚 Docker/CI/脚本/配置；OpenAPI Stage 0 baseline 不应静默重写，契约变更需通过 breaking 检查。

## 下一阶段注意事项

先在 Docker 可用环境执行镜像 build/run/health/SIGTERM，并在真实托管平台触发 workflow。全部通过后更新本报告和 Stage 1 勾选状态，再开始 Stage 2。

## 用户/评审确认状态

- 用户已授权执行 Stage 1 下一步。
- 本地实现和自动门禁通过。
- 容器/远端 CI 证据缺失，等待具备相应环境或授权后补验。

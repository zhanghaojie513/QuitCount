# ADR-012：华为云部署拓扑与 PostgreSQL 托管版本

- 状态：proposed
- 日期：2026-07-24
- 责任角色：项目负责人、后端负责人、运维负责人
- 复核门禁：Stage 2 真实 RDS 连接前；最迟 Stage 8 创建云资源前

## 背景与已确认事实

用户已确认拥有华为云账号，华为云作为本项目优先部署平台。当前尚未确认账号/IAM 结构、地域、预算、配额、备案、域名、证书、VPC、安全组或任何已创建资源。

ADR-002 接受 PostgreSQL 18，并允许在最终托管平台不支持 18 时通过新 ADR 回退 PostgreSQL 17。华为云 2026-07-15 更新的 RDS for PostgreSQL 购买说明以 17.4.x 为示例最高版本，并强调不同地域的版本能力不同；当前不能假设目标地域存在 RDS for PostgreSQL 18。

## 建议决策

在目标地域、费用和配额确认后，MVP 优先采用：

- 应用托管：`CAE` 部署非 root OCI 镜像；需要 Kubernetes 控制面或复杂工作负载时改选 `CCE Autopilot`/`CCE Standard`。
- 镜像：`SWR` 私有仓库，使用 commit SHA 和 digest，启用扫描并保留发布追溯。
- 数据库：优先 `RDS for PostgreSQL 17` 当前安全 minor，私网接入、生产主备、自动备份和磁盘加密；这将正式修订 ADR-002 的生产数据库主版本，但本地 schema 与 migration 必须先在 17 上验证。
- 可观测性：应用 JSON 日志进入 `LTS`，指标和告警进入 `AOM/CES`；继续执行脱敏和最小化采集。
- Secret 与密钥：使用 `DEW/KMS/CSMS` 或目标地域可用的等价华为云能力，不把长期凭据写入源码、镜像或 CI 配置。
- 导出与归档：需要时使用默认私有、加密并带生命周期策略的 `OBS`；导出下载链接必须短时、一次性或可撤销。
- 网络：应用与 RDS 位于同地域 VPC；数据库无公网入口，安全组只允许应用和 migration 执行器；公网入口、WAF/APIG/ELB、DNS 与证书按备案、流量和成本确认。

如果项目明确要求 PostgreSQL 18，则不采用当前 RDS 17 路线：必须等待目标地域提供托管 18，或建立自管 PostgreSQL 18 的补丁、备份、监控、主备、恢复和 on-call 责任。未经演练不得选择自管路线。

## 选择依据

- CAE 支持从容器镜像部署 Web/API 应用，提供生命周期管理、升级、回退和弹性，适合当前模块化单体的低运维起步。
- CCE 是托管 Kubernetes，适合多工作负载、复杂灰度和明确云原生运维需求，但当前阶段没有足够规模证据必须承担集群复杂度。
- SWR 提供私有镜像托管、分发和扫描，可与 CAE/CCE 的镜像部署链路衔接。
- RDS 将数据库补丁、主备、备份等运维责任交给托管服务；但主版本必须服从目标地域实际能力。
- LTS 可接入 CCE、CAE、RDS、ELB、CTS、DEW 等日志，适合作为集中日志与告警基础。

## 未决项

1. 华为云账号是否使用企业主账号、独立 IAM 用户/用户组或多账号组织。
2. 目标 Region/AZ、是否涉及中国大陆备案、域名和证书来源。
3. CAE 在目标地域的可用性、费用、最小实例数、私网/RDS 连接和滚动发布能力是否满足 SLO。
4. PostgreSQL 17 RDS 与 PostgreSQL 18 自管路线二选一；首选 RDS 17，但需项目负责人接受版本修订。
5. 测试/预发布/生产资源规格、月度预算、RPO/RTO、备份保留、跨 AZ 和跨 Region 要求。
6. GitHub Actions 到华为云采用 OIDC/联邦身份还是受控 AK/SK；长期凭据路线必须说明轮换和最小权限。
7. WAF、APIG、ELB、NAT、EIP、OBS、DEW、CTS 的必要性和费用边界。

## 验收与回滚门禁

- 在目标地域控制台复核 CAE/CCE、RDS 主版本、SWR、LTS/AOM 和 Secret 能力，不以其他地域文档代替。
- 在 PostgreSQL 17 空库和前一 migration 快照执行 `prisma migrate deploy`、约束测试、备份恢复和性能 smoke。
- 用 IaC 创建 staging，构建镜像、推送 SWR、部署、健康检查、滚动升级、回退、告警和 Secret 轮换全链路通过。
- 若 CAE 不满足网络、运行时或 SLO，回退候选为 CCE Autopilot；应用镜像与数据库契约不得为平台迁移而重写。
- 若 RDS 17 兼容性失败，停止云写入，不降级约束；重新评估自管 PostgreSQL 18 或等待托管 18。

## 官方依据

- [华为云 CAE 产品介绍](https://support.huaweicloud.com/productdesc-cae/cae_01_0001.html)
- [华为云 CCE 产品介绍](https://support.huaweicloud.com/productdesc-cce/cce_productdesc_0001.html)
- [华为云 SWR 产品介绍](https://support.huaweicloud.com/productdesc-swr/swr_03_0001.html)
- [华为云 RDS for PostgreSQL 购买说明](https://support.huaweicloud.com/usermanual-rds-pg/rds_pg_10_0028.html)
- [华为云 RDS for PostgreSQL 支持的扩展与版本](https://support.huaweicloud.com/intl/en-us/usermanual-rds-pg/rds_09_0045.html)
- [华为云 LTS 云服务接入](https://support.huaweicloud.com/intl/zh-cn/usermanual-lts/lts_04_0510.html)
- [华为云 RDS 磁盘加密](https://support.huaweicloud.com/intl/en-us/usermanual-rds-pg/rds_pg_05_0025.html)

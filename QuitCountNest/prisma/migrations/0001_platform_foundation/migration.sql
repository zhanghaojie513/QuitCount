-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DELETION_PENDING', 'DELETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DevicePlatform" AS ENUM ('HARMONYOS', 'OTHER');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "ChangeOperation" AS ENUM ('UPSERT', 'DELETE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "locale" VARCHAR(16) NOT NULL DEFAULT 'zh-CN',
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Shanghai',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "clientInstanceId" VARCHAR(128) NOT NULL,
    "platform" "DevicePlatform" NOT NULL,
    "appVersion" VARCHAR(32) NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_versions" (
    "id" VARCHAR(64) NOT NULL,
    "modelType" VARCHAR(64) NOT NULL,
    "parameters" JSONB NOT NULL,
    "checksum" VARCHAR(128) NOT NULL,
    "effectiveAt" TIMESTAMPTZ(3) NOT NULL,
    "retiredAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_log" (
    "seq" BIGSERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "entityType" VARCHAR(64) NOT NULL,
    "entityId" UUID NOT NULL,
    "operation" "ChangeOperation" NOT NULL,
    "entityVersion" BIGINT,
    "payload" JSONB,
    "serverTime" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_log_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "idempotency_records" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scope" VARCHAR(64) NOT NULL,
    "key" VARCHAR(128) NOT NULL,
    "requestHash" VARCHAR(128) NOT NULL,
    "responseStatus" INTEGER,
    "responseBody" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "idempotency_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "actorUserId" UUID,
    "action" VARCHAR(128) NOT NULL,
    "resourceType" VARCHAR(64),
    "resourceId" UUID,
    "requestId" VARCHAR(64),
    "ipHash" VARCHAR(128),
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "devices_userId_status_idx" ON "devices"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "devices_userId_clientInstanceId_key" ON "devices"("userId", "clientInstanceId");

-- CreateIndex
CREATE INDEX "model_versions_modelType_effectiveAt_idx" ON "model_versions"("modelType", "effectiveAt");

-- CreateIndex
CREATE INDEX "change_log_userId_seq_idx" ON "change_log"("userId", "seq");

-- CreateIndex
CREATE INDEX "change_log_userId_entityType_entityId_seq_idx" ON "change_log"("userId", "entityType", "entityId", "seq");

-- CreateIndex
CREATE INDEX "idempotency_records_expiresAt_idx" ON "idempotency_records"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_records_userId_scope_key_key" ON "idempotency_records"("userId", "scope", "key");

-- CreateIndex
CREATE INDEX "audit_events_userId_createdAt_idx" ON "audit_events"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_events_action_createdAt_idx" ON "audit_events"("action", "createdAt");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_log" ADD CONSTRAINT "change_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idempotency_records" ADD CONSTRAINT "idempotency_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Database-enforced invariants that Prisma schema cannot fully express.
ALTER TABLE "devices"
ADD CONSTRAINT "devices_revocation_state_check"
CHECK (
  ("status" = 'ACTIVE' AND "revokedAt" IS NULL)
  OR ("status" = 'REVOKED' AND "revokedAt" IS NOT NULL)
);

ALTER TABLE "model_versions"
ADD CONSTRAINT "model_versions_effective_window_check"
CHECK ("retiredAt" IS NULL OR "retiredAt" > "effectiveAt");

ALTER TABLE "change_log"
ADD CONSTRAINT "change_log_entity_version_check"
CHECK ("entityVersion" IS NULL OR "entityVersion" > 0);

ALTER TABLE "idempotency_records"
ADD CONSTRAINT "idempotency_records_response_status_check"
CHECK ("responseStatus" IS NULL OR "responseStatus" BETWEEN 100 AND 599);

ALTER TABLE "idempotency_records"
ADD CONSTRAINT "idempotency_records_expiry_check"
CHECK ("expiresAt" > "createdAt");

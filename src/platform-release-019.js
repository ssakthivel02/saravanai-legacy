import { handleBuild018PlatformApi } from './platform-release-018.js';
import { tenantRehearsalSummary, TENANT_REHEARSAL_RELEASE } from './tenant-rehearsal-plan.js';
import { tenantBackupSummary, TENANT_BACKUP_RELEASE } from './tenant-backup-contract.js';
import { tenantRestoreSummary, TENANT_RESTORE_RELEASE } from './tenant-restore-contract.js';
import { tenantIsolationAssuranceSummary, TENANT_ISOLATION_ASSURANCE_RELEASE } from './tenant-isolation-assurance.js';
import { tenantDeletionAssuranceSummary, TENANT_DELETION_ASSURANCE_RELEASE } from './tenant-deletion-assurance.js';
import { tenantRecoveryPolicy, tenantRecoverySummary, TENANT_RECOVERY_RELEASE } from './tenant-recovery-policy.js';

export const PLATFORM_RELEASE_019 = '0.19.0-tenant-lifecycle-assurance';
export const OWNER_BUILD_019 = 19;

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  });
}

export function build019LifecycleContract(env = {}) {
  const recovery = tenantRecoveryPolicy(env);
  return {
    tenantLifecycleRelease: TENANT_RECOVERY_RELEASE,
    rehearsal: tenantRehearsalSummary(),
    backup: tenantBackupSummary(),
    restore: tenantRestoreSummary(),
    isolation: tenantIsolationAssuranceSummary(),
    deletion: tenantDeletionAssuranceSummary(),
    recovery: tenantRecoverySummary(env),
    nextGate: recovery.operational
      ? 'Review the complete non-production evidence packet. Production migration, restore, deletion and writes remain separately prohibited.'
      : 'Complete owner Access, endpoint authorisation and non-production migration, backup, restore, isolation and deletion evidence before any storage operation.'
  };
}

function augmentPayload(payload, env, pathname) {
  const contract = build019LifecycleContract(env);
  const result = {
    ...payload,
    platformRelease: PLATFORM_RELEASE_019,
    ownerBuild: OWNER_BUILD_019,
    components: {
      ...(payload.components || {}),
      tenantRehearsal: TENANT_REHEARSAL_RELEASE,
      tenantBackup: TENANT_BACKUP_RELEASE,
      tenantRestore: TENANT_RESTORE_RELEASE,
      tenantIsolationAssurance: TENANT_ISOLATION_ASSURANCE_RELEASE,
      tenantDeletionAssurance: TENANT_DELETION_ASSURANCE_RELEASE,
      tenantLifecycle: TENANT_RECOVERY_RELEASE
    },
    activation: {
      ...(payload.activation || {}),
      tenantLifecycleAssuranceEnabled: contract.recovery.operational,
      tenantLifecycleEmergencyStopped: contract.recovery.emergencyStopped,
      tenantLifecycleEvidenceComplete: contract.recovery.evidenceComplete,
      productionMigrationAllowed: false,
      productionRestoreAllowed: false,
      productionDeletionAllowed: false
    },
    tenantLifecycleRelease: TENANT_RECOVERY_RELEASE
  };

  if (pathname === '/api/v1/platform/capabilities') {
    result.features = {
      ...(payload.features || {}),
      tenantLifecycleAssurance: {
        prepared: true,
        operational: contract.recovery.operational,
        evidenceComplete: contract.recovery.evidenceComplete,
        nonProductionOnly: true,
        automaticMigration: false,
        automaticBackup: false,
        automaticRestore: false,
        automaticDeletion: false,
        paidRecoveryServiceRequired: false
      }
    };
  }

  if (pathname === '/api/v1/platform/session') {
    result.tenantLifecycleAssuranceEnabled = contract.recovery.operational;
    result.productionStorageActionsAllowed = false;
  }

  if (pathname === '/api/v1/mobile/config') {
    result.persistence = 'Browser-local by default; tenant persistence and lifecycle assurance remain disabled and non-production-only.';
    result.endpoints = { ...(payload.endpoints || {}), tenantLifecycle: '/api/v1/platform/storage/lifecycle' };
  }

  if (pathname === '/api/v1/platform/storage/readiness') {
    result.lifecycle = contract;
    result.boundaries = {
      ...(payload.boundaries || {}),
      productionMigrationAllowed: false,
      productionRestoreAllowed: false,
      productionDeletionAllowed: false,
      automaticRecoveryEnabled: false
    };
  }

  if (pathname === '/api/v1/platform/release') result.nextManualGate = contract.nextGate;
  return result;
}

const WRAPPED_PATHS = new Set([
  '/api/v1/platform/release',
  '/api/v1/platform/access/readiness',
  '/api/v1/platform/capabilities',
  '/api/v1/platform/session',
  '/api/v1/platform/storage/readiness',
  '/api/v1/mobile/config'
]);

export async function handleBuild019PlatformApi(request, env, url) {
  if (request.method === 'GET' && url.pathname === '/api/v1/platform/storage/lifecycle') {
    const contract = build019LifecycleContract(env);
    return json({
      status: 'ok',
      platformRelease: PLATFORM_RELEASE_019,
      ownerBuild: OWNER_BUILD_019,
      lifecycle: contract,
      boundaries: {
        fullEmailExposed: false,
        tenantIdExposed: false,
        profileKeyExposed: false,
        jwtExposed: false,
        evidencePayloadPersisted: false,
        migrationExecuted: false,
        backupExecuted: false,
        restoreExecuted: false,
        deletionExecuted: false,
        productionWritesEnabled: false,
        publicRegistration: false,
        paidFallbackEnabled: false
      },
      checkedAt: new Date().toISOString()
    });
  }

  if (request.method !== 'GET' || !WRAPPED_PATHS.has(url.pathname)) return null;
  const response = await handleBuild018PlatformApi(request, env, url);
  if (!response) return null;
  const payload = await response.json();
  return json(augmentPayload(payload, env, url.pathname), response.status);
}

export const __test = { augmentPayload, WRAPPED_PATHS };

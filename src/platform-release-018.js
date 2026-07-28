import { handleBuild017PlatformApi } from './platform-release-017.js';
import { resolveTenantContext, tenantContextSummary, TENANT_CONTEXT_RELEASE } from './tenant-context.js';
import { tenantStoragePolicy, tenantStorageReadiness, TENANT_STORAGE_RELEASE } from './tenant-storage-policy.js';
import { tenantRecordContractSummary, TENANT_RECORD_RELEASE } from './tenant-record-contract.js';
import { tenantQuotaPolicy, TENANT_QUOTA_RELEASE } from './tenant-quota-policy.js';
import { tenantRetentionPolicy, TENANT_RETENTION_RELEASE } from './tenant-retention-policy.js';
import { TENANT_REPOSITORY_RELEASE } from './tenant-repository.js';

export const PLATFORM_RELEASE_018 = '0.18.0-tenant-persistence-foundation';
export const OWNER_BUILD_018 = 18;

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  });
}

export async function build018StorageContract(request, env = {}) {
  const context = await resolveTenantContext(request);
  const storage = tenantStoragePolicy(env);
  return {
    tenantPersistenceRelease: TENANT_STORAGE_RELEASE,
    tenantContextRelease: TENANT_CONTEXT_RELEASE,
    tenantRecordRelease: TENANT_RECORD_RELEASE,
    tenantQuotaRelease: TENANT_QUOTA_RELEASE,
    tenantRetentionRelease: TENANT_RETENTION_RELEASE,
    tenantRepositoryRelease: TENANT_REPOSITORY_RELEASE,
    context: tenantContextSummary(context),
    storage: tenantStorageReadiness(env),
    recordContract: tenantRecordContractSummary(),
    quota: tenantQuotaPolicy(env),
    retention: tenantRetentionPolicy(),
    nextGate: storage.readsOperational
      ? 'Validate read-only owner metadata queries and cross-tenant denial before preparing any write implementation.'
      : 'Keep migration 0009 unexecuted until owner Access, endpoint authorisation, D1 binding and rollback rehearsal are complete.'
  };
}

async function augmentPayload(payload, request, env, pathname) {
  const contract = await build018StorageContract(request, env);
  const result = {
    ...payload,
    platformRelease: PLATFORM_RELEASE_018,
    ownerBuild: OWNER_BUILD_018,
    components: {
      ...(payload.components || {}),
      tenantContext: TENANT_CONTEXT_RELEASE,
      tenantPersistence: TENANT_STORAGE_RELEASE,
      tenantRepository: TENANT_REPOSITORY_RELEASE
    },
    activation: {
      ...(payload.activation || {}),
      tenantPersistenceEnabled: contract.storage.operations.readsOperational,
      tenantWritesEnabled: contract.storage.operations.writesOperational,
      tenantSchemaReady: contract.storage.schema.ready,
      tenantMigrationAutomaticallyExecuted: false
    },
    tenantPersistenceRelease: TENANT_STORAGE_RELEASE
  };

  if (pathname === '/api/v1/platform/capabilities') {
    result.features = {
      ...(payload.features || {}),
      tenantPersistence: {
        prepared: true,
        bindingPresent: contract.storage.bindingPresent,
        schemaReady: contract.storage.schema.ready,
        readsOperational: contract.storage.operations.readsOperational,
        writesOperational: contract.storage.operations.writesOperational,
        encryptedPayloadRequired: true,
        emailPersistenceAllowed: false,
        tenantIdExposed: false
      }
    };
    result.bindings = { ...(payload.bindings || {}), tenantD1: contract.storage.bindingPresent };
  }

  if (pathname === '/api/v1/platform/session') {
    result.tenantContextReady = contract.context.valid;
    result.tenantIdExposed = false;
    result.crossDeviceProfileSyncEnabled = contract.storage.operations.readsOperational;
  }

  if (pathname === '/api/v1/mobile/config') {
    result.persistence = 'Browser-local by default; verified tenant D1 persistence foundation prepared and disabled.';
    result.endpoints = { ...(payload.endpoints || {}), storageReadiness: '/api/v1/platform/storage/readiness' };
  }

  if (pathname === '/api/v1/platform/access/readiness') {
    result.boundaries = {
      ...(payload.boundaries || {}),
      tenantPersistenceEnabled: contract.storage.operations.readsOperational,
      tenantWritesEnabled: contract.storage.operations.writesOperational,
      tenantIdExposed: false,
      emailsPersisted: false
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
  '/api/v1/mobile/config'
]);

export async function handleBuild018PlatformApi(request, env, url) {
  if (request.method === 'GET' && url.pathname === '/api/v1/platform/storage/readiness') {
    const contract = await build018StorageContract(request, env);
    return json({
      status: 'ok',
      platformRelease: PLATFORM_RELEASE_018,
      ownerBuild: OWNER_BUILD_018,
      persistence: contract,
      boundaries: {
        fullEmailExposed: false,
        tenantIdExposed: false,
        profileKeyExposed: false,
        jwtExposed: false,
        migrationExecuted: false,
        writesExecuted: false,
        publicRegistration: false,
        paidFallbackEnabled: false
      },
      checkedAt: new Date().toISOString()
    });
  }

  if (request.method !== 'GET' || !WRAPPED_PATHS.has(url.pathname)) return null;
  const response = await handleBuild017PlatformApi(request, env, url);
  if (!response) return null;
  const payload = await response.json();
  return json(await augmentPayload(payload, request, env, url.pathname), response.status);
}

export const __test = { augmentPayload, WRAPPED_PATHS };
import { resolveTenantContext } from './tenant-context.js';
import { tenantStoragePolicy } from './tenant-storage-policy.js';
import { validateTenantRecord } from './tenant-record-contract.js';
import { evaluateTenantQuota } from './tenant-quota-policy.js';

export const TENANT_REPOSITORY_RELEASE = 'tenant-repository-foundation-1.0.0';

function safeLimit(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 100 ? parsed : 25;
}

export function createTenantRepository(env = {}) {
  const policy = tenantStoragePolicy(env);

  async function listMetadata(request, options = {}) {
    const context = await resolveTenantContext(request);
    if (!context.valid) return { ok: false, status: context.status, code: context.code, records: [] };
    if (!policy.readsOperational) return { ok: false, status: 503, code: 'TENANT_STORAGE_READS_DISABLED', records: [] };

    const resourceType = String(options.resourceType || '').trim();
    const limit = safeLimit(options.limit);
    const statement = env.SAKTHI_DB.prepare(
      'SELECT record_id, resource_type, content_type, payload_bytes, created_at, updated_at FROM tenant_records WHERE tenant_id = ?1 AND deleted_at IS NULL AND (?2 = \'\' OR resource_type = ?2) ORDER BY updated_at DESC LIMIT ?3'
    ).bind(context.tenantId, resourceType, limit);
    const result = await statement.all();
    return { ok: true, status: 200, code: 'TENANT_METADATA_LISTED', records: result.results || [], tenantIdExposed: false };
  }

  async function previewWrite(request, input = {}, usage = {}) {
    const context = await resolveTenantContext(request);
    if (!context.valid) return { ok: false, status: context.status, code: context.code };
    const record = validateTenantRecord(input);
    if (!record.valid) return { ok: false, status: 422, code: 'TENANT_RECORD_INVALID', errors: record.errors };
    const quota = evaluateTenantQuota(usage, record.record.payloadBytes, env);
    if (!quota.allowed) return { ok: false, status: 429, code: quota.code, exceeded: quota.exceeded };
    return {
      ok: true,
      status: 200,
      code: policy.writesOperational ? 'TENANT_WRITE_ELIGIBLE_NOT_EXECUTED' : 'TENANT_WRITE_PREVIEW_ONLY',
      executable: false,
      writesOperational: policy.writesOperational,
      tenantIdExposed: false,
      record: record.record,
      quota: { code: quota.code, exceeded: quota.exceeded }
    };
  }

  return Object.freeze({
    release: TENANT_REPOSITORY_RELEASE,
    policy,
    listMetadata,
    previewWrite,
    writeImplemented: false,
    deleteImplemented: false
  });
}

export const __test = { safeLimit };
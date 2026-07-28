import { tenantStoragePolicy } from './tenant-storage-policy.js';

export const TENANT_QUOTA_RELEASE = 'tenant-quota-policy-1.0.0';

const DEFAULTS = Object.freeze({
  maximumRecords: 1000,
  maximumStoredBytes: 50 * 1024 * 1024,
  maximumDailyWrites: 200,
  maximumRecordBytes: 256 * 1024
});

function boundedInteger(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

export function tenantQuotaPolicy(env = {}) {
  const storage = tenantStoragePolicy(env);
  const configured = {
    maximumRecords: boundedInteger(env.TENANT_MAX_RECORDS, DEFAULTS.maximumRecords, 1, 100000),
    maximumStoredBytes: boundedInteger(env.TENANT_MAX_STORED_BYTES, DEFAULTS.maximumStoredBytes, 1024, 1024 * 1024 * 1024),
    maximumDailyWrites: boundedInteger(env.TENANT_MAX_DAILY_WRITES, DEFAULTS.maximumDailyWrites, 1, 100000),
    maximumRecordBytes: boundedInteger(env.TENANT_MAX_RECORD_BYTES, DEFAULTS.maximumRecordBytes, 1024, 1024 * 1024)
  };
  const hardQuotaEnabled = storage.writesOperational && String(env.TENANT_HARD_QUOTA_ENABLED || '').toLowerCase() === 'true';
  return Object.freeze({
    release: TENANT_QUOTA_RELEASE,
    limits: configured,
    hardQuotaEnabled,
    enforcement: hardQuotaEnabled ? 'server-hard-limit' : 'preview-only-disabled-by-default',
    paidOverageAllowed: false,
    silentPaidFallback: false
  });
}

export function evaluateTenantQuota(usage = {}, requestedBytes = 0, env = {}) {
  const policy = tenantQuotaPolicy(env);
  const current = {
    records: Number.isFinite(Number(usage.records)) ? Number(usage.records) : null,
    storedBytes: Number.isFinite(Number(usage.storedBytes)) ? Number(usage.storedBytes) : null,
    dailyWrites: Number.isFinite(Number(usage.dailyWrites)) ? Number(usage.dailyWrites) : null
  };
  if (policy.hardQuotaEnabled && Object.values(current).some((value) => value === null)) {
    return { allowed: false, code: 'TENANT_QUOTA_USAGE_UNAVAILABLE', policy };
  }
  const projectedBytes = (current.storedBytes || 0) + Number(requestedBytes || 0);
  const exceeded = [];
  if ((current.records || 0) + 1 > policy.limits.maximumRecords) exceeded.push('records');
  if (projectedBytes > policy.limits.maximumStoredBytes) exceeded.push('storedBytes');
  if ((current.dailyWrites || 0) + 1 > policy.limits.maximumDailyWrites) exceeded.push('dailyWrites');
  if (Number(requestedBytes || 0) > policy.limits.maximumRecordBytes) exceeded.push('recordBytes');
  return {
    allowed: policy.hardQuotaEnabled ? exceeded.length === 0 : true,
    code: exceeded.length ? (policy.hardQuotaEnabled ? 'TENANT_QUOTA_EXCEEDED' : 'TENANT_QUOTA_PREVIEW_EXCEEDED') : 'TENANT_QUOTA_OK',
    exceeded,
    policy
  };
}

export const __test = { boundedInteger, DEFAULTS };
export const TENANT_ISOLATION_ASSURANCE_RELEASE = 'tenant-isolation-assurance-1.0.0';

const EXPECTED_CASES = Object.freeze([
  'owner-own-record-allowed',
  'member-own-record-allowed',
  'reader-own-record-read-only',
  'cross-tenant-read-denied',
  'cross-tenant-write-denied',
  'browser-tenant-override-ignored',
  'unknown-record-denied',
  'deleted-record-hidden'
]);

function clean(value, max = 256) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function evaluateTenantIsolationEvidence(input = {}) {
  const environment = clean(input.environment, 64).toLowerCase();
  const cases = Array.isArray(input.cases) ? input.cases : [];
  const map = new Map(cases.map((item) => [clean(item?.id, 96), item]));
  const findings = [];

  if (!['local', 'preview', 'non-production'].includes(environment)) findings.push('ISOLATION_NON_PRODUCTION_ENVIRONMENT_REQUIRED');

  for (const id of EXPECTED_CASES) {
    const item = map.get(id);
    if (!item) {
      findings.push(`ISOLATION_CASE_MISSING:${id}`);
      continue;
    }
    const result = clean(item.result, 32).toLowerCase();
    const digest = clean(item.evidenceDigest, 64).toLowerCase();
    if (result !== 'pass') findings.push(`ISOLATION_CASE_NOT_PASSED:${id}`);
    if (!/^[a-f0-9]{64}$/.test(digest)) findings.push(`ISOLATION_CASE_DIGEST_INVALID:${id}`);
  }

  return {
    release: TENANT_ISOLATION_ASSURANCE_RELEASE,
    valid: findings.length === 0,
    findings,
    environment,
    requiredCaseCount: EXPECTED_CASES.length,
    suppliedCaseCount: cases.length,
    decision: findings.length ? 'block' : 'eligible-for-owner-review',
    crossTenantAccessAllowed: false,
    browserTenantOverrideAllowed: false,
    productionExecutionAllowed: false,
    evidencePersisted: false
  };
}

export function tenantIsolationAssuranceSummary() {
  return {
    release: TENANT_ISOLATION_ASSURANCE_RELEASE,
    requiredCases: [...EXPECTED_CASES],
    crossTenantAccessAllowed: false,
    browserTenantOverrideAllowed: false,
    evidencePersistenceEnabled: false
  };
}

export const __test = { clean, EXPECTED_CASES };

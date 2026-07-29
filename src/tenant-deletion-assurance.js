export const TENANT_DELETION_ASSURANCE_RELEASE = 'tenant-deletion-assurance-1.0.0';

const REQUIRED_STEPS = Object.freeze([
  'identity-verified',
  'tenant-scope-verified',
  'owner-approval-recorded',
  'export-completed',
  'legal-hold-checked',
  'tombstone-created',
  'dependent-indexes-checked',
  'deletion-evidence-reviewed'
]);

function clean(value, max = 256) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function evaluateDeletionEvidence(input = {}) {
  const environment = clean(input.environment, 64).toLowerCase();
  const resourceType = clean(input.resourceType, 64);
  const recordId = clean(input.recordId, 128);
  const steps = Array.isArray(input.steps) ? input.steps : [];
  const map = new Map(steps.map((step) => [clean(step?.id, 96), step]));
  const findings = [];

  if (!['local', 'preview', 'non-production'].includes(environment)) findings.push('DELETE_NON_PRODUCTION_ENVIRONMENT_REQUIRED');
  if (!resourceType) findings.push('DELETE_RESOURCE_TYPE_REQUIRED');
  if (!/^[a-z0-9][a-z0-9._:-]{2,127}$/.test(recordId)) findings.push('DELETE_RECORD_ID_INVALID');
  if (input.legalHoldActive === true) findings.push('DELETE_BLOCKED_BY_LEGAL_HOLD');

  for (const id of REQUIRED_STEPS) {
    const step = map.get(id);
    if (!step) {
      findings.push(`DELETE_STEP_MISSING:${id}`);
      continue;
    }
    if (clean(step.result, 32).toLowerCase() !== 'pass') findings.push(`DELETE_STEP_NOT_PASSED:${id}`);
    if (!/^[a-f0-9]{64}$/.test(clean(step.evidenceDigest, 64).toLowerCase())) findings.push(`DELETE_STEP_DIGEST_INVALID:${id}`);
  }

  return {
    release: TENANT_DELETION_ASSURANCE_RELEASE,
    valid: findings.length === 0,
    findings,
    decision: findings.length ? 'block' : 'eligible-for-owner-review',
    environment,
    resourceType,
    recordIdPresent: Boolean(recordId),
    hardDeleteExecuted: false,
    automaticPurgeEnabled: false,
    crossTenantDeletionAllowed: false,
    ownerApprovalRequired: true,
    productionDeletionAllowed: false
  };
}

export function tenantDeletionAssuranceSummary() {
  return {
    release: TENANT_DELETION_ASSURANCE_RELEASE,
    requiredSteps: [...REQUIRED_STEPS],
    hardDeleteImplemented: false,
    automaticPurgeEnabled: false,
    legalHoldCheckRequired: true,
    exportBeforeDeletionRequired: true
  };
}

export const __test = { clean, REQUIRED_STEPS };

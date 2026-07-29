export const TENANT_REHEARSAL_RELEASE = 'tenant-migration-rehearsal-1.0.0';

const REQUIRED_STAGES = Object.freeze([
  'baseline-export',
  'schema-apply',
  'schema-verify',
  'tenant-isolation',
  'backup-export',
  'restore-drill',
  'deletion-preview',
  'rollback-rehearsal',
  'evidence-review'
]);

function clean(value, max = 256) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normaliseStage(stage = {}) {
  return {
    id: clean(stage.id, 64),
    result: clean(stage.result, 32).toLowerCase(),
    evidenceDigest: clean(stage.evidenceDigest, 64).toLowerCase(),
    environment: clean(stage.environment, 64).toLowerCase(),
    notes: clean(stage.notes, 500)
  };
}

export function evaluateTenantRehearsal(input = {}) {
  const environment = clean(input.environment, 64).toLowerCase();
  const migration = clean(input.migration, 64);
  const stages = Array.isArray(input.stages) ? input.stages.map(normaliseStage) : [];
  const byId = new Map(stages.map((stage) => [stage.id, stage]));
  const findings = [];

  if (!['local', 'preview', 'non-production'].includes(environment)) findings.push('REHEARSAL_NON_PRODUCTION_ENVIRONMENT_REQUIRED');
  if (migration !== '0009') findings.push('REHEARSAL_MIGRATION_0009_REQUIRED');

  for (const id of REQUIRED_STAGES) {
    const stage = byId.get(id);
    if (!stage) {
      findings.push(`REHEARSAL_STAGE_MISSING:${id}`);
      continue;
    }
    if (stage.result !== 'pass') findings.push(`REHEARSAL_STAGE_NOT_PASSED:${id}`);
    if (!/^[a-f0-9]{64}$/.test(stage.evidenceDigest)) findings.push(`REHEARSAL_STAGE_DIGEST_INVALID:${id}`);
    if (stage.environment && stage.environment !== environment) findings.push(`REHEARSAL_STAGE_ENVIRONMENT_MISMATCH:${id}`);
  }

  return {
    release: TENANT_REHEARSAL_RELEASE,
    valid: findings.length === 0,
    decision: findings.length ? 'block' : 'eligible-for-owner-review',
    environment,
    migration,
    stageCount: stages.length,
    requiredStageCount: REQUIRED_STAGES.length,
    findings,
    productionExecutionAllowed: false,
    migrationExecuted: false,
    writesExecuted: false,
    rollbackExecuted: false,
    ownerApprovalRequired: true,
    evidencePersisted: false
  };
}

export function tenantRehearsalSummary() {
  return {
    release: TENANT_REHEARSAL_RELEASE,
    requiredStages: [...REQUIRED_STAGES],
    productionExecutionAllowed: false,
    migrationAutomaticallyExecuted: false,
    evidencePersistenceEnabled: false
  };
}

export const __test = { clean, normaliseStage, REQUIRED_STAGES };

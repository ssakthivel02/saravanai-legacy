import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTenantRehearsal, tenantRehearsalSummary } from '../src/tenant-rehearsal-plan.js';

const digest = 'a'.repeat(64);
const stages = tenantRehearsalSummary().requiredStages.map((id) => ({ id, result: 'pass', evidenceDigest: digest, environment: 'non-production' }));

test('complete non-production rehearsal becomes eligible only for owner review', () => {
  const result = evaluateTenantRehearsal({ environment: 'non-production', migration: '0009', stages });
  assert.equal(result.valid, true);
  assert.equal(result.decision, 'eligible-for-owner-review');
  assert.equal(result.productionExecutionAllowed, false);
  assert.equal(result.migrationExecuted, false);
});

test('production environment and missing evidence fail closed', () => {
  const result = evaluateTenantRehearsal({ environment: 'production', migration: '0009', stages: stages.slice(0, -1) });
  assert.equal(result.valid, false);
  assert.equal(result.decision, 'block');
  assert.ok(result.findings.includes('REHEARSAL_NON_PRODUCTION_ENVIRONMENT_REQUIRED'));
  assert.ok(result.findings.some((item) => item.startsWith('REHEARSAL_STAGE_MISSING:')));
});

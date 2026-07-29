import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTenantIsolationEvidence, tenantIsolationAssuranceSummary } from '../src/tenant-isolation-assurance.js';

const digest = 'f'.repeat(64);
const cases = tenantIsolationAssuranceSummary().requiredCases.map((id) => ({ id, result: 'pass', evidenceDigest: digest }));

test('complete cross-tenant evidence becomes eligible for review', () => {
  const result = evaluateTenantIsolationEvidence({ environment: 'local', cases });
  assert.equal(result.valid, true);
  assert.equal(result.crossTenantAccessAllowed, false);
  assert.equal(result.browserTenantOverrideAllowed, false);
});

test('missing cross-tenant denial evidence blocks the gate', () => {
  const result = evaluateTenantIsolationEvidence({ environment: 'preview', cases: cases.filter((item) => item.id !== 'cross-tenant-read-denied') });
  assert.equal(result.valid, false);
  assert.ok(result.findings.includes('ISOLATION_CASE_MISSING:cross-tenant-read-denied'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDeletionEvidence, tenantDeletionAssuranceSummary } from '../src/tenant-deletion-assurance.js';

const digest = '1'.repeat(64);
const steps = tenantDeletionAssuranceSummary().requiredSteps.map((id) => ({ id, result: 'pass', evidenceDigest: digest }));

test('complete deletion evidence remains non-executing and owner-reviewed', () => {
  const result = evaluateDeletionEvidence({
    environment: 'non-production',
    resourceType: 'project',
    recordId: 'project:demo-001',
    legalHoldActive: false,
    steps
  });
  assert.equal(result.valid, true);
  assert.equal(result.hardDeleteExecuted, false);
  assert.equal(result.productionDeletionAllowed, false);
});

test('legal hold blocks deletion regardless of other evidence', () => {
  const result = evaluateDeletionEvidence({
    environment: 'preview',
    resourceType: 'project',
    recordId: 'project:demo-001',
    legalHoldActive: true,
    steps
  });
  assert.equal(result.valid, false);
  assert.ok(result.findings.includes('DELETE_BLOCKED_BY_LEGAL_HOLD'));
});

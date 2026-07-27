import test from 'node:test';
import assert from 'node:assert/strict';
import { RUNTIME_WAVE_NUMBERS_31_50, getRuntimeWave31To50 } from '../src/runtime-v31-50/catalog.js';
import {
  assessControls,
  evaluateDecisionGate,
  evaluateScenario,
  ownerBoundary,
  runtimeState,
  safeSideEffects,
  validateEvidence,
  validateException
} from '../src/runtime-v31-50/core.js';
import {
  handleRuntimeWaves31To50,
  runtimeWaves31To50Health,
  __test
} from '../src/runtime-waves31-50.js';

const accessHeaders = {
  'cf-access-authenticated-user-email': 'owner@example.com',
  'cf-access-jwt-assertion': 'verified-access-token'
};

const envFor = (wave, overrides = {}) => ({
  OWNER_EMAIL: 'owner@example.com',
  [`RUNTIME_WAVE${wave}_ENABLED`]: 'true',
  [`RUNTIME_WAVE${wave}_EMERGENCY_STOP`]: 'false',
  ...overrides
});

const post = (url, body, headers = {}) => new Request(url, {
  method: 'POST',
  headers: { ...accessHeaders, 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body)
});

const completeControls = (wave) => wave.controls.map((id) => ({
  id,
  status: 'implemented',
  score: 94,
  weight: 100 / wave.controls.length,
  owner: 'owner@example.com',
  evidenceRefs: [`evidence-${id}`]
}));

const completeGateEvidence = (wave) =>
  Object.fromEntries(wave.gate.map((key) => [key, 'pass']));

test('catalog contains exactly Waves 31 through 50', () => {
  assert.deepEqual(RUNTIME_WAVE_NUMBERS_31_50, Array.from({ length: 20 }, (_, index) => index + 31));
});

test('every wave has unique, complete assurance metadata', () => {
  const slugs = new Set();
  for (const number of RUNTIME_WAVE_NUMBERS_31_50) {
    const wave = getRuntimeWave31To50(number);
    assert.ok(wave.title.length > 8);
    assert.ok(wave.description.length > 60);
    assert.ok(wave.controls.length >= 8);
    assert.ok(wave.gate.length >= 7);
    assert.equal(slugs.has(wave.slug), false);
    slugs.add(wave.slug);
  }
});

test('all side-effect capabilities are disabled', () => {
  assert.ok(Object.values(safeSideEffects()).every((value) => value === false));
});

test('owner boundary requires Cloudflare Access identity and JWT', () => {
  const request = new Request('https://example.test', {
    headers: { 'cf-access-authenticated-user-email': 'owner@example.com' }
  });
  assert.equal(ownerBoundary(request, envFor(31)).code, 'ACCESS_AUTHENTICATION_REQUIRED');
});

test('owner boundary rejects a non-owner identity', () => {
  const request = new Request('https://example.test', {
    headers: { ...accessHeaders, 'cf-access-authenticated-user-email': 'other@example.com' }
  });
  assert.equal(ownerBoundary(request, envFor(31)).code, 'OWNER_ACCESS_DENIED');
});

test('route parser accepts only Waves 31 through 50', () => {
  assert.deepEqual(__test.parseWavePath('/api/v1/runtime/v31/status'), { number: 31, action: 'status' });
  assert.deepEqual(__test.parseWavePath('/api/v50/decision/gate'), null);
  assert.deepEqual(__test.parseWavePath('/api/v1/runtime/v50/decision/gate'), { number: 50, action: 'decision/gate' });
  assert.equal(__test.parseWavePath('/api/v1/runtime/v30/status'), null);
  assert.equal(__test.parseWavePath('/api/v1/runtime/v51/status'), null);
});

test('health projection exposes every release without activation', () => {
  const health = runtimeWaves31To50Health({});
  for (const number of RUNTIME_WAVE_NUMBERS_31_50) {
    assert.equal(health[`runtimeWave${number}Release`], `runtime-wave-${number}.0.0`);
    assert.equal(health[`runtimeWave${number}Enabled`], false);
    assert.equal(health[`runtimeWave${number}EmergencyStopped`], true);
  }
});

test('route action registry is strictly metadata-only', () => {
  assert.deepEqual(
    Object.keys(__test.ROUTE_ACTIONS).sort(),
    ['controls/assess', 'decision/gate', 'evidence/validate', 'exception/validate', 'scenario/evaluate']
  );
});

for (const number of RUNTIME_WAVE_NUMBERS_31_50) {
  const wave = getRuntimeWave31To50(number);

  test(`Wave ${number} defaults disabled and emergency-stopped`, () => {
    assert.deepEqual(runtimeState(number, {}), {
      enabled: false,
      emergencyStopped: true,
      operational: false
    });
  });

  test(`Wave ${number} public status is safe and metadata-only`, async () => {
    const url = new URL(`https://example.test/api/v1/runtime/v${number}/status`);
    const response = await handleRuntimeWaves31To50(new Request(url), {}, url);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.release, `runtime-wave-${number}.0.0`);
    assert.equal(body.enabled, false);
    assert.equal(body.emergencyStopped, true);
    assert.equal(body.operational, false);
    assert.equal(body.metadataOnly, true);
    assert.equal(body.productionWritesEnabled, false);
    assert.equal(body.billingEnabled, false);
    assert.equal(body.autonomousDecisionsEnabled, false);
  });

  test(`Wave ${number} private route requires Cloudflare Access`, async () => {
    const url = new URL(`https://example.test/api/v1/runtime/v${number}/controls/assess`);
    const response = await handleRuntimeWaves31To50(
      new Request(url, { method: 'POST', body: '{}' }),
      envFor(number),
      url
    );
    assert.equal(response.status, 401);
  });

  test(`Wave ${number} disabled state blocks private evaluation`, async () => {
    const url = new URL(`https://example.test/api/v1/runtime/v${number}/controls/assess`);
    const response = await handleRuntimeWaves31To50(
      post(url, { controls: [] }),
      { OWNER_EMAIL: 'owner@example.com' },
      url
    );
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.code, `RUNTIME_WAVE_${number}_DISABLED`);
  });

  test(`Wave ${number} emergency stop blocks private evaluation`, async () => {
    const url = new URL(`https://example.test/api/v1/runtime/v${number}/controls/assess`);
    const response = await handleRuntimeWaves31To50(
      post(url, { controls: [] }),
      envFor(number, { [`RUNTIME_WAVE${number}_EMERGENCY_STOP`]: 'true' }),
      url
    );
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.code, `RUNTIME_WAVE_${number}_EMERGENCY_STOPPED`);
  });

  test(`Wave ${number} complete controls produce a strong posture`, () => {
    const result = assessControls(wave, { controls: completeControls(wave) });
    assert.equal(result.valid, true);
    assert.equal(result.assessment.posture, 'strong');
    assert.equal(result.assessment.persisted, false);
    assert.equal(result.assessment.policyEnforcementEnabled, false);
  });

  test(`Wave ${number} missing control is rejected`, () => {
    const result = assessControls(wave, {
      controls: completeControls(wave).slice(0, -1)
    });
    assert.equal(result.valid, false);
    assert.ok(result.findings.some((value) => value.startsWith('control_missing:')));
  });

  test(`Wave ${number} evidence validation never retrieves or publishes`, () => {
    const result = validateEvidence(wave, {
      items: [{
        id: `evidence-${number}`,
        controlId: wave.controls[0],
        type: 'review-record',
        source: `https://example.test/evidence/${number}`,
        digest: 'b'.repeat(64),
        status: 'pass',
        classification: 'internal',
        observedAt: '2026-07-27T00:00:00Z',
        expiresAt: '2026-10-27T00:00:00Z'
      }]
    });
    assert.equal(result.valid, true);
    assert.equal(result.evidence.sourcesFetched, false);
    assert.equal(result.evidence.evidencePublished, false);
    assert.equal(result.evidence.personalDataPersisted, false);
  });

  test(`Wave ${number} evidence rejects non-HTTPS sources`, () => {
    const result = validateEvidence(wave, {
      items: [{
        id: `evidence-${number}`,
        controlId: wave.controls[0],
        type: 'review-record',
        source: 'http://insecure.example.test',
        digest: 'b'.repeat(64),
        status: 'pass',
        classification: 'internal',
        observedAt: '2026-07-27T00:00:00Z'
      }]
    });
    assert.equal(result.valid, false);
    assert.ok(result.findings.includes('evidence_0_source_https_required'));
  });

  test(`Wave ${number} scenario evaluation remains non-executing`, () => {
    const result = evaluateScenario(wave, {
      assumptions: ['All evidence is caller-supplied and independently reviewed.'],
      threats: [{
        id: `threat-${number}`,
        impact: 'high',
        likelihood: 'possible',
        mitigation: 'Apply manual control review and retain emergency stop.',
        confidence: 'high',
        residualImpact: 'medium',
        residualLikelihood: 'unlikely'
      }]
    });
    assert.equal(result.valid, true);
    assert.equal(result.scenario.decision, 'review-ready');
    assert.equal(result.scenario.simulatedActionsExecuted, false);
    assert.equal(result.scenario.infrastructureChangesEnabled, false);
  });

  test(`Wave ${number} validates a time-bounded exception without applying it`, () => {
    const result = validateException(wave, {
      owner: 'owner@example.com',
      reason: 'Temporary documented exception pending independent control remediation.',
      createdAt: '2026-07-27T00:00:00Z',
      expiresAt: '2026-09-25T00:00:00Z',
      compensatingControls: ['Keep the wave emergency-stopped.'],
      verification: ['Independent weekly evidence review.'],
      rollback: ['Remove exception and restore the standard control.']
    });
    assert.equal(result.valid, true);
    assert.equal(result.exception.approved, false);
    assert.equal(result.exception.applied, false);
    assert.ok(result.exception.durationDays <= 180);
  });

  test(`Wave ${number} rejects an overlong exception`, () => {
    const result = validateException(wave, {
      owner: 'owner@example.com',
      reason: 'Temporary documented exception pending independent control remediation.',
      createdAt: '2026-07-27T00:00:00Z',
      expiresAt: '2027-07-27T00:00:00Z',
      compensatingControls: ['Keep the wave emergency-stopped.'],
      verification: ['Independent weekly evidence review.'],
      rollback: ['Remove exception and restore the standard control.']
    });
    assert.equal(result.valid, false);
    assert.ok(result.findings.includes('exception_exceeds_180_day_limit'));
  });

  test(`Wave ${number} gate is eligible only for a manual owner decision`, () => {
    const result = evaluateDecisionGate(wave, {
      evidence: completeGateEvidence(wave),
      residualRisk: 'low',
      independentReview: true,
      ownerReview: true,
      rollbackVerified: true
    });
    assert.equal(result.valid, true);
    assert.equal(result.gate.decision, 'eligible-for-manual-owner-decision');
    assert.equal(result.gate.approved, false);
    assert.equal(result.gate.executed, false);
  });

  test(`Wave ${number} gate denies autonomous, paid and high-stakes actions`, () => {
    const result = evaluateDecisionGate(wave, {
      evidence: completeGateEvidence(wave),
      residualRisk: 'low',
      independentReview: true,
      ownerReview: true,
      rollbackVerified: true,
      autoExecuteRequested: true,
      autoApproveRequested: true,
      autoWriteRequested: true,
      autoPublishRequested: true,
      paymentRequested: true,
      billingRequested: true,
      paidProviderRequested: true,
      publicRegistrationRequested: true,
      certificationClaimRequested: true,
      legalDeterminationRequested: true,
      medicalDeterminationRequested: true,
      financialDeterminationRequested: true
    });
    assert.equal(result.valid, false);
    assert.equal(result.gate.decision, 'block');
    assert.equal(result.gate.paymentsEnabled, false);
    assert.equal(result.gate.billingEnabled, false);
    assert.equal(result.gate.legalDeterminationsEnabled, false);
    assert.equal(result.gate.medicalDeterminationsEnabled, false);
    assert.equal(result.gate.financialDeterminationsEnabled, false);
  });
}

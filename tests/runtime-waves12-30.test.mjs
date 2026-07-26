import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RUNTIME_WAVE_NUMBERS,
  getWave,
  assessDimensions,
  classifyRisk,
  evaluateGate,
  ownerBoundary,
  runtimeState,
  safeSideEffects,
  validateEvidence,
  validatePlan,
  handleRuntimeWaves12To30,
  runtimeWaves12To30Health,
  __test
} from '../src/runtime-waves12-30.js';

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

const completeDimensions = (wave) => wave.dimensions.map((id) => ({
  id,
  score: 92,
  weight: 100 / wave.dimensions.length,
  result: 'pass',
  evidence: `Reviewed evidence for ${id}.`
}));

const completeGateEvidence = (wave) =>
  Object.fromEntries(wave.gateEvidence.map((key) => [key, 'pass']));

test('catalog contains exactly Waves 12 through 30', () => {
  assert.deepEqual(RUNTIME_WAVE_NUMBERS, Array.from({ length: 19 }, (_, index) => index + 12));
});

test('every wave has distinct enterprise metadata', () => {
  const slugs = new Set();
  for (const number of RUNTIME_WAVE_NUMBERS) {
    const wave = getWave(number);
    assert.equal(typeof wave.title, 'string');
    assert.ok(wave.title.length > 8);
    assert.ok(wave.description.length > 50);
    assert.ok(wave.dimensions.length >= 7);
    assert.ok(wave.gateEvidence.length >= 7);
    assert.equal(slugs.has(wave.slug), false);
    slugs.add(wave.slug);
  }
});

test('safe side effects are entirely disabled', () => {
  assert.ok(Object.values(safeSideEffects()).every((value) => value === false));
});

test('owner boundary requires Cloudflare Access identity and JWT', () => {
  const request = new Request('https://example.test', {
    headers: { 'cf-access-authenticated-user-email': 'owner@example.com' }
  });
  assert.equal(ownerBoundary(request, envFor(12)).code, 'ACCESS_AUTHENTICATION_REQUIRED');
});

test('owner boundary rejects a different authenticated user', () => {
  const request = new Request('https://example.test', {
    headers: { ...accessHeaders, 'cf-access-authenticated-user-email': 'other@example.com' }
  });
  assert.equal(ownerBoundary(request, envFor(12)).code, 'OWNER_ACCESS_DENIED');
});

test('route parser accepts only Waves 12 through 30', () => {
  assert.deepEqual(__test.parseWavePath('/api/v1/runtime/v12/status'), { number: 12, action: 'status' });
  assert.deepEqual(__test.parseWavePath('/api/v1/runtime/v30/gate'), { number: 30, action: 'gate' });
  assert.equal(__test.parseWavePath('/api/v1/runtime/v11/status'), null);
  assert.equal(__test.parseWavePath('/api/v1/runtime/v31/status'), null);
});

test('health projection exposes every release without enabling it', () => {
  const health = runtimeWaves12To30Health({});
  for (const number of RUNTIME_WAVE_NUMBERS) {
    assert.equal(health[`runtimeWave${number}Release`], `runtime-wave-${number}.0.0`);
    assert.equal(health[`runtimeWave${number}Enabled`], false);
    assert.equal(health[`runtimeWave${number}EmergencyStopped`], true);
  }
});

for (const number of RUNTIME_WAVE_NUMBERS) {
  const wave = getWave(number);

  test(`Wave ${number} defaults disabled and emergency-stopped`, () => {
    const state = runtimeState(number, {});
    assert.deepEqual(state, { enabled: false, emergencyStopped: true, operational: false });
  });

  test(`Wave ${number} public status is safe and metadata-only`, async () => {
    const url = new URL(`https://example.test/api/v1/runtime/v${number}/status`);
    const response = await handleRuntimeWaves12To30(new Request(url), {}, url);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.release, `runtime-wave-${number}.0.0`);
    assert.equal(body.enabled, false);
    assert.equal(body.emergencyStopped, true);
    assert.equal(body.operational, false);
    assert.equal(body.metadataOnly, true);
    assert.equal(body.productionWritesEnabled, false);
    assert.equal(body.paidProvidersEnabled, false);
  });

  test(`Wave ${number} private assessment requires Access`, async () => {
    const url = new URL(`https://example.test/api/v1/runtime/v${number}/assess`);
    const response = await handleRuntimeWaves12To30(
      new Request(url, { method: 'POST', body: '{}' }),
      envFor(number),
      url
    );
    assert.equal(response.status, 401);
  });

  test(`Wave ${number} disabled gate is enforced`, async () => {
    const url = new URL(`https://example.test/api/v1/runtime/v${number}/assess`);
    const response = await handleRuntimeWaves12To30(
      post(url, { dimensions: [] }),
      { OWNER_EMAIL: 'owner@example.com' },
      url
    );
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.code, `RUNTIME_WAVE_${number}_DISABLED`);
  });

  test(`Wave ${number} emergency stop is enforced`, async () => {
    const url = new URL(`https://example.test/api/v1/runtime/v${number}/assess`);
    const response = await handleRuntimeWaves12To30(
      post(url, { dimensions: [] }),
      envFor(number, { [`RUNTIME_WAVE${number}_EMERGENCY_STOP`]: 'true' }),
      url
    );
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.code, `RUNTIME_WAVE_${number}_EMERGENCY_STOPPED`);
  });

  test(`Wave ${number} complete dimension assessment is deterministic and non-persistent`, () => {
    const result = assessDimensions(wave, { dimensions: completeDimensions(wave) });
    assert.equal(result.valid, true);
    assert.equal(result.assessment.rating, 'strong');
    assert.equal(result.assessment.persisted, false);
    assert.equal(result.assessment.autonomousActionsEnabled, false);
  });

  test(`Wave ${number} assessment rejects a missing configured dimension`, () => {
    const result = assessDimensions(wave, {
      dimensions: completeDimensions(wave).slice(0, -1)
    });
    assert.equal(result.valid, false);
    assert.ok(result.findings.some((value) => value.startsWith('dimension_missing:')));
  });

  test(`Wave ${number} evidence validation never fetches or publishes evidence`, () => {
    const result = validateEvidence(wave, {
      items: [{
        id: `evidence-${number}`,
        type: 'review-record',
        source: `https://example.test/evidence/${number}`,
        digest: 'a'.repeat(64),
        result: 'pass',
        observedAt: '2026-07-27T00:00:00Z'
      }]
    });
    assert.equal(result.valid, true);
    assert.equal(result.evidence.sourcesFetched, false);
    assert.equal(result.evidence.evidencePublished, false);
  });

  test(`Wave ${number} risk classification never permits execution`, () => {
    const result = classifyRisk(wave, {
      impact: 'high',
      likelihood: 'likely',
      reversibility: 'difficult',
      regulated: true,
      humanImpact: true
    });
    assert.equal(result.valid, true);
    assert.ok(result.classification.tier >= 3);
    assert.equal(result.classification.executionAllowed, false);
  });

  test(`Wave ${number} plan validation remains bounded and unexecuted`, () => {
    const result = validatePlan(wave, {
      steps: ['prepare evidence', 'perform human review', 'record decision'],
      owners: ['owner@example.com'],
      dependencies: ['existing-controls'],
      verification: ['independent check'],
      rollback: ['restore emergency stop']
    });
    assert.equal(result.valid, true);
    assert.equal(result.plan.approved, false);
    assert.equal(result.plan.executed, false);
  });

  test(`Wave ${number} gate becomes eligible only with complete evidence`, () => {
    const result = evaluateGate(wave, { evidence: completeGateEvidence(wave) });
    assert.equal(result.valid, true);
    assert.equal(result.gate.decision, 'eligible-for-owner-approval');
    assert.equal(result.gate.approved, false);
    assert.equal(result.gate.executed, false);
  });

  test(`Wave ${number} gate denies autonomous, paid and certification requests`, () => {
    const result = evaluateGate(wave, {
      evidence: completeGateEvidence(wave),
      autoExecuteRequested: true,
      autoWriteRequested: true,
      autoPublishRequested: true,
      paymentRequested: true,
      paidProviderRequested: true,
      publicRegistrationRequested: true,
      certificationClaimRequested: true
    });
    assert.equal(result.valid, false);
    assert.equal(result.gate.decision, 'block');
    assert.equal(result.gate.paymentsEnabled, false);
    assert.equal(result.gate.certificationClaimsEnabled, false);
  });
}

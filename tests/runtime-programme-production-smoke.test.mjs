import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSmokePlan,
  expectedEndpoints,
  validateStatusPayload
} from '../scripts/runtime-programme-production-smoke.mjs';

test('smoke plan covers health, programme status and Waves 1 through 50', () => {
  const plan = buildSmokePlan('https://example.test/');
  assert.equal(plan.length, 52);
  assert.equal(expectedEndpoints.length, 52);
  assert.equal(plan[0].url, 'https://example.test/health');
  assert.equal(plan[1].path, '/api/v1/runtime/programme/status');
  assert.equal(plan.at(-1).path, '/api/v1/runtime/v50/status');
  assert.ok(plan.every((item) => item.method === 'GET'));
  assert.ok(plan.every((item) => item.mutationAllowed === false));
  assert.ok(plan.every((item) => item.credentialsRequired === false));
});

test('programme status requires all safety controls to remain false', () => {
  const result = validateStatusPayload('/api/v1/runtime/programme/status', {
    status: 'ok',
    totalWaves: 50,
    operationalCount: 0,
    publicRegistration: false,
    productionWritesEnabled: false,
    billingEnabled: false,
    paidProvidersEnabled: false,
    autonomousActionsEnabled: false
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.findings, []);
});

test('programme status rejects an operational wave or unsafe feature', () => {
  const result = validateStatusPayload('/api/v1/runtime/programme/status', {
    status: 'ok',
    totalWaves: 50,
    operationalCount: 1,
    publicRegistration: true,
    productionWritesEnabled: false,
    billingEnabled: false,
    paidProvidersEnabled: false,
    autonomousActionsEnabled: false
  });
  assert.equal(result.valid, false);
  assert.ok(result.findings.includes('programme_operational_waves_not_zero'));
  assert.ok(result.findings.includes('public_registration_not_false'));
});

test('Wave 1 accepts disabled non-operational status without an emergency-stop field', () => {
  const result = validateStatusPayload('/api/v1/runtime/v1/status', {
    status: 'ok',
    enabled: false,
    operational: false,
    publicRegistration: false
  });
  assert.equal(result.valid, true);
});

test('Waves 2 through 50 require emergency stop true', () => {
  const safe = validateStatusPayload('/api/v1/runtime/v50/status', {
    status: 'ok',
    enabled: false,
    emergencyStopped: true,
    operational: false,
    publicRegistration: false
  });
  assert.equal(safe.valid, true);

  const unsafe = validateStatusPayload('/api/v1/runtime/v50/status', {
    status: 'ok',
    enabled: false,
    emergencyStopped: false,
    operational: false,
    publicRegistration: false
  });
  assert.equal(unsafe.valid, false);
  assert.ok(unsafe.findings.includes('wave_50_emergency_stop_not_true'));
});

test('status validator rejects non-JSON-object payloads', () => {
  assert.equal(validateStatusPayload('/health', null).valid, false);
  assert.equal(validateStatusPayload('/health', []).valid, false);
});

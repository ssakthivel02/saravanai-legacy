import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RUNTIME_PROGRAMME_RELEASE,
  RUNTIME_PROGRAMME_WAVE_COUNT,
  handleRuntimeProgrammeControl,
  runtimeProgrammeHealth,
  __test
} from '../src/runtime-programme-control.js';

const accessHeaders = {
  'cf-access-authenticated-user-email': 'owner@example.com',
  'cf-access-jwt-assertion': 'verified-access-token'
};
const ownerEnv = { OWNER_EMAIL: 'owner@example.com' };
const request = (url, method = 'GET', body = undefined, headers = {}) => new Request(url, {
  method,
  headers: { ...headers, ...(body === undefined ? {} : { 'content-type': 'application/json' }) },
  body: body === undefined ? undefined : JSON.stringify(body)
});

test('programme release and catalogue cover exactly Waves 1 through 50', () => {
  const summary = __test.programmeSummary({});
  assert.equal(RUNTIME_PROGRAMME_RELEASE, 'runtime-programme-control-1.0.0');
  assert.equal(RUNTIME_PROGRAMME_WAVE_COUNT, 50);
  assert.equal(summary.waves.length, 50);
  assert.deepEqual(summary.waves.map((wave) => wave.number), Array.from({ length: 50 }, (_, index) => index + 1));
});

test('default state is disabled, emergency-stopped and non-operational for all waves', () => {
  const summary = __test.programmeSummary({});
  assert.equal(summary.state.enabledCount, 0);
  assert.equal(summary.state.disabledCount, 50);
  assert.equal(summary.state.emergencyStoppedCount, 50);
  assert.equal(summary.state.operationalCount, 0);
  assert.equal(summary.safety.status, 'safe-by-default');
});

test('an enabled wave remains non-operational while emergency stopped', () => {
  const state = __test.waveState(12, { RUNTIME_WAVE12_ENABLED: 'true' });
  assert.equal(state.enabled, true);
  assert.equal(state.emergencyStopped, true);
  assert.equal(state.operational, false);
});

test('a wave is operational only when explicitly enabled and explicitly released from stop', () => {
  const state = __test.waveState(12, {
    RUNTIME_WAVE12_ENABLED: 'true',
    RUNTIME_WAVE12_EMERGENCY_STOP: 'false'
  });
  assert.equal(state.operational, true);
});

test('unsafe billing, public registration and write flags are detected', () => {
  const findings = __test.unsafeConfigurationFindings({
    PUBLIC_REGISTRATION_ENABLED: 'true',
    UNIFIED_BILLING_ENABLED: 'true',
    RUNTIME_WAVE31_WRITES_ENABLED: 'true'
  });
  assert.ok(findings.includes('PUBLIC_REGISTRATION_ENABLED_MUST_REMAIN_DISABLED'));
  assert.ok(findings.includes('UNIFIED_BILLING_ENABLED_MUST_REMAIN_DISABLED'));
  assert.ok(findings.includes('RUNTIME_WAVE31_WRITES_ENABLED_MUST_REMAIN_DISABLED'));
});

test('public programme status is safe and contains no owner identity', async () => {
  const url = new URL('https://example.test/api/v1/runtime/programme/status');
  const response = await handleRuntimeProgrammeControl(request(url), {}, url);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.totalWaves, 50);
  assert.equal(body.operationalCount, 0);
  assert.equal(body.publicRegistration, false);
  assert.equal(body.productionWritesEnabled, false);
  assert.equal(JSON.stringify(body).includes('OWNER_EMAIL'), false);
});

test('private control centre requires Cloudflare Access identity', async () => {
  const url = new URL('https://example.test/api/v1/runtime/programme/control-centre');
  const response = await handleRuntimeProgrammeControl(request(url), ownerEnv, url);
  assert.equal(response.status, 401);
});

test('private control centre rejects a different authenticated identity', async () => {
  const url = new URL('https://example.test/api/v1/runtime/programme/control-centre');
  const response = await handleRuntimeProgrammeControl(
    request(url, 'GET', undefined, {
      ...accessHeaders,
      'cf-access-authenticated-user-email': 'other@example.com'
    }),
    ownerEnv,
    url
  );
  assert.equal(response.status, 403);
});

test('private JSON control centre returns all wave states to the exact owner', async () => {
  const url = new URL('https://example.test/api/v1/runtime/programme/control-centre');
  const response = await handleRuntimeProgrammeControl(request(url, 'GET', undefined, accessHeaders), ownerEnv, url);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.totalWaves, 50);
  assert.equal(body.waves.length, 50);
  assert.equal(body.safety.ownerEmailConfigured, true);
});

test('HTML dashboard is owner-only, script-free and does not expose email', async () => {
  const url = new URL('https://example.test/runtime/control-centre');
  const response = await handleRuntimeProgrammeControl(request(url, 'GET', undefined, accessHeaders), ownerEnv, url);
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /SakthiAI Runtime Programme 1–50/);
  assert.match(body, /Wave state matrix/);
  assert.equal(body.includes('<script'), false);
  assert.equal(body.includes('owner@example.com'), false);
});

test('evidence validator accepts complete caller-supplied metadata without fetching', () => {
  const result = __test.validateEvidence({
    packets: [{
      id: 'programme-checks',
      scope: 'programme',
      reference: 'commit:abc123',
      checkName: 'exact-head GitHub Actions',
      conclusion: 'success',
      observedAt: '2026-07-27T06:40:00Z',
      reviewer: 'owner'
    }]
  });
  assert.equal(result.valid, true);
  assert.equal(result.evidence.sourcesFetched, false);
  assert.equal(result.evidence.persisted, false);
});

test('evidence validator rejects missing and failed evidence', () => {
  const result = __test.validateEvidence({
    packets: [{
      id: 'bad',
      scope: 'programme',
      reference: '',
      checkName: '',
      conclusion: 'failure',
      observedAt: 'not-a-date',
      reviewer: ''
    }]
  });
  assert.equal(result.valid, false);
  assert.ok(result.findings.length >= 5);
});

test('smoke plan covers health, fifty wave statuses and programme status without executing', () => {
  const result = __test.createSmokePlan({});
  assert.equal(result.valid, true);
  assert.equal(result.plan.endpointCount, 52);
  assert.equal(result.plan.executed, false);
  assert.equal(result.plan.externalCallsEnabled, false);
  assert.equal(result.plan.endpoints[0].id, 'health');
  assert.equal(result.plan.endpoints.at(-1).id, 'runtime-programme');
});

test('smoke plan rejects non-HTTPS base URL', () => {
  const result = __test.createSmokePlan({ baseUrl: 'http://example.test' });
  assert.equal(result.valid, false);
});

test('release gate blocks incomplete evidence and unsafe configuration', () => {
  const result = __test.evaluateReleaseGate(
    { exactHeadChecksPassed: true },
    { PUBLIC_REGISTRATION_ENABLED: 'true' }
  );
  assert.equal(result.valid, false);
  assert.equal(result.gate.decision, 'block');
  assert.equal(result.gate.merged, false);
});

test('release gate can become eligible but never approves, merges or deploys', () => {
  const result = __test.evaluateReleaseGate({
    exactHeadChecksPassed: true,
    smokeSuitePassed: true,
    rollbackReviewed: true,
    ownerReviewed: true,
    evidenceIndexReviewed: true,
    cloudflareHealthy: true,
    migrationExecuted: false,
    enableVariablesAdded: false,
    emergencyStopVariablesAdded: false
  }, {});
  assert.equal(result.valid, true);
  assert.equal(result.gate.decision, 'eligible-for-manual-owner-merge');
  assert.equal(result.gate.approved, false);
  assert.equal(result.gate.merged, false);
  assert.equal(result.gate.deployed, false);
});

test('rollback plan is detailed but never executed', () => {
  const result = __test.rollbackPlan({ targetCommit: 'abc123' });
  assert.equal(result.valid, true);
  assert.equal(result.rollback.target, 'abc123');
  assert.ok(result.rollback.steps.length >= 7);
  assert.equal(result.rollback.executed, false);
  assert.equal(result.rollback.deploymentChanged, false);
});

test('health projection exposes programme safety without secrets', () => {
  const health = runtimeProgrammeHealth({});
  assert.equal(health.runtimeProgrammeTotalWaves, 50);
  assert.equal(health.runtimeProgrammeOperationalWaves, 0);
  assert.equal(health.runtimeProgrammeSafetyStatus, 'safe-by-default');
});

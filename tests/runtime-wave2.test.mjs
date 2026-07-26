import test from 'node:test';
import assert from 'node:assert/strict';

import { classifyApproval } from '../src/runtime-v2/approval.js';
import { ownerBoundary, wave2State } from '../src/runtime-v2/boundary.js';
import { inspectIdempotency } from '../src/runtime-v2/idempotency.js';
import { createLeaseProposal } from '../src/runtime-v2/lease.js';
import { wave2Observability } from '../src/runtime-v2/observability.js';
import { compileBoundedPlan } from '../src/runtime-v2/planner.js';
import { buildRollbackPlan } from '../src/runtime-v2/rollback.js';
import { assessToolRequest, WAVE2_TOOL_REGISTRY } from '../src/runtime-v2/tool-registry.js';
import { handleRuntimeWave2, RUNTIME_WAVE_2_RELEASE } from '../src/runtime-wave2.js';

const headers = {
  'cf-access-authenticated-user-email': 'owner@example.com',
  'cf-access-jwt-assertion': 'verified'
};

const enabledEnv = {
  OWNER_EMAIL: 'owner@example.com',
  RUNTIME_WAVE2_ENABLED: 'true',
  RUNTIME_WAVE2_EMERGENCY_STOP: 'false'
};

function request(url, init = {}) {
  return new Request(url, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) }
  });
}

test('release identifier is stable', () => {
  assert.equal(RUNTIME_WAVE_2_RELEASE, 'runtime-wave-2.0.0');
});

test('Wave 2 defaults to disabled and emergency stopped', () => {
  const state = wave2State({});
  assert.equal(state.enabled, false);
  assert.equal(state.emergencyStopped, true);
  assert.equal(state.operational, false);
});

test('Wave 2 needs both enable and stop release flags', () => {
  assert.equal(wave2State({ RUNTIME_WAVE2_ENABLED: 'true' }).operational, false);
  assert.equal(wave2State(enabledEnv).operational, true);
});

test('owner boundary requires Access JWT', () => {
  const result = ownerBoundary(new Request('https://example.com', {
    headers: { 'cf-access-authenticated-user-email': 'owner@example.com' }
  }), enabledEnv);
  assert.equal(result.allowed, false);
  assert.equal(result.code, 'ACCESS_AUTHENTICATION_REQUIRED');
});

test('owner boundary rejects wrong user', () => {
  const result = ownerBoundary(new Request('https://example.com', {
    headers: {
      'cf-access-authenticated-user-email': 'other@example.com',
      'cf-access-jwt-assertion': 'verified'
    }
  }), enabledEnv);
  assert.equal(result.code, 'OWNER_ACCESS_DENIED');
});

test('tool registry contains read and preview tools only', () => {
  assert.equal(Object.values(WAVE2_TOOL_REGISTRY).every((tool) => !tool.writes && !tool.external), true);
});

test('unknown tool is denied', () => {
  assert.equal(assessToolRequest('email.send').code, 'TOOL_NOT_ALLOWLISTED');
});

test('allowlisted tool remains non-executable', () => {
  const result = assessToolRequest('runtime.status');
  assert.equal(result.allowed, true);
  assert.equal(result.executionAllowed, false);
});

test('bounded plan accepts an allowlisted plan', () => {
  const result = compileBoundedPlan({
    objective: 'Review current runtime posture',
    steps: [
      { type: 'analyse', description: 'Review request' },
      { type: 'retrieve-preview', toolId: 'runtime.status', description: 'Read status' },
      { type: 'human-review', description: 'Owner reviews output' }
    ]
  });
  assert.equal(result.valid, true);
  assert.equal(result.executionMode, 'plan-only');
  assert.equal(result.steps.every((step) => !step.executionAllowed), true);
});

test('bounded plan rejects too many steps', () => {
  const result = compileBoundedPlan({
    objective: 'Too many',
    steps: Array.from({ length: 9 }, () => ({ type: 'analyse' }))
  });
  assert.equal(result.valid, false);
  assert.equal(result.findings.includes('step_limit_exceeded'), true);
});

test('bounded plan rejects unknown tools', () => {
  const result = compileBoundedPlan({
    objective: 'Unsafe',
    steps: [{ type: 'retrieve-preview', toolId: 'shell.execute' }]
  });
  assert.equal(result.valid, false);
});

test('lease proposal is never authoritative', () => {
  const result = createLeaseProposal({ toolId: 'runtime.status' }, { tenantId: 'owner' });
  assert.equal(result.valid, true);
  assert.equal(result.executionAllowed, false);
  assert.equal(result.cryptographicAuthority, false);
  assert.equal(result.persisted, false);
});

test('lease proposal rejects execution request', () => {
  const result = createLeaseProposal({ toolId: 'runtime.status', execute: true }, { tenantId: 'owner' });
  assert.equal(result.valid, false);
  assert.equal(result.reasons.includes('execution_flag_denied'), true);
});

test('approval classifier cannot grant approval', () => {
  const result = classifyApproval({ actionClass: 'configuration-change' });
  assert.equal(result.valid, true);
  assert.equal(result.approvalGranted, false);
});

test('high-risk action requires independent review', () => {
  const result = classifyApproval({ actionClass: 'deployment' });
  assert.equal(result.required, 'independent-four-eyes-review');
});

test('claimed approval is rejected', () => {
  const result = classifyApproval({ actionClass: 'deployment', approved: true });
  assert.equal(result.valid, false);
  assert.equal(result.findings.includes('wave2_cannot_grant_approval'), true);
});

test('rollback plan accepts bounded manual actions', () => {
  const result = buildRollbackPlan({
    changeId: 'change-123',
    actions: [
      { type: 'disable-feature-flag', instruction: 'Disable Wave 2' },
      { type: 'notify-owner', instruction: 'Notify owner' }
    ]
  });
  assert.equal(result.valid, true);
  assert.equal(result.executionAllowed, false);
});

test('rollback plan rejects arbitrary command', () => {
  const result = buildRollbackPlan({
    changeId: 'change-123',
    actions: [{ type: 'run-shell-command', instruction: 'rm -rf /' }]
  });
  assert.equal(result.valid, false);
});

test('idempotency contract validates a strong key', async () => {
  const result = await inspectIdempotency({
    idempotencyKey: 'sakthiai:request:1234567890',
    payload: { action: 'preview' }
  });
  assert.equal(result.valid, true);
  assert.equal(result.persisted, false);
  assert.equal(result.payloadSha256.length, 64);
});

test('idempotency contract rejects a short key', async () => {
  const result = await inspectIdempotency({
    idempotencyKey: 'short',
    payload: { action: 'preview' }
  });
  assert.equal(result.valid, false);
});

test('observability exposes controls but no content', () => {
  const result = wave2Observability(enabledEnv);
  assert.equal(result.controls.sensitiveContentLogging, false);
  assert.equal(result.controls.externalExecution, false);
  assert.equal(result.controls.databaseWrites, false);
});

test('public status route reports stopped state safely', async () => {
  const response = await handleRuntimeWave2(
    new Request('https://example.com/api/v1/runtime/v2/status'),
    {},
    new URL('https://example.com/api/v1/runtime/v2/status')
  );
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.operational, false);
  assert.equal(body.productionWritesEnabled, false);
});

test('private route requires owner identity', async () => {
  const response = await handleRuntimeWave2(
    new Request('https://example.com/api/v1/runtime/v2/observability'),
    enabledEnv,
    new URL('https://example.com/api/v1/runtime/v2/observability')
  );
  assert.equal(response.status, 401);
});

test('disabled Wave 2 rejects private route', async () => {
  const req = request('https://example.com/api/v1/runtime/v2/observability');
  const response = await handleRuntimeWave2(
    req,
    { OWNER_EMAIL: 'owner@example.com' },
    new URL(req.url)
  );
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'RUNTIME_WAVE_2_DISABLED');
});

test('emergency stop rejects private route', async () => {
  const req = request('https://example.com/api/v1/runtime/v2/observability');
  const response = await handleRuntimeWave2(
    req,
    { OWNER_EMAIL: 'owner@example.com', RUNTIME_WAVE2_ENABLED: 'true' },
    new URL(req.url)
  );
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'RUNTIME_WAVE_2_EMERGENCY_STOPPED');
});

test('owner can obtain a plan-only agent plan when operational', async () => {
  const req = request('https://example.com/api/v1/runtime/v2/agent/plan', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      objective: 'Review governance',
      steps: [{ type: 'retrieve-preview', toolId: 'governance.read' }]
    })
  });
  const response = await handleRuntimeWave2(req, enabledEnv, new URL(req.url));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.result.executionMode, 'plan-only');
});

test('owner can create only a lease proposal', async () => {
  const req = request('https://example.com/api/v1/runtime/v2/tools/lease-proposal', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ toolId: 'runtime.status' })
  });
  const response = await handleRuntimeWave2(req, enabledEnv, new URL(req.url));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.result.executionAllowed, false);
  assert.equal(body.result.persisted, false);
});

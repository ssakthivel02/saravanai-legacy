import test from 'node:test';
import assert from 'node:assert/strict';

import {
  accessIdentity,
  maskedEmail,
  requireOwner
} from '../src/runtime/identity.js';
import {
  containsRuntimeSecret,
  createAiRequestEnvelope
} from '../src/runtime/ai-envelope.js';
import { runtimeObservabilitySnapshot } from '../src/runtime/observability.js';
import { assessOutputSafety } from '../src/runtime/output-safety.js';
import {
  evaluateRuntimePolicy,
  RUNTIME_WAVE_1_ACTIONS
} from '../src/runtime/policy.js';
import { sha256 } from '../src/runtime/shared.js';
import {
  enforceTenantBoundary,
  normaliseTenantId,
  resolveTenantContext
} from '../src/runtime/tenant.js';
import {
  handleRuntimeWave1,
  RUNTIME_WAVE_1_RELEASE
} from '../src/runtime-wave1.js';

const ownerHeaders = {
  'cf-access-authenticated-user-email': 'owner@example.com',
  'cf-access-jwt-assertion': 'verified-by-cloudflare-access'
};

function ownerRequest(url, init = {}) {
  return new Request(url, {
    ...init,
    headers: {
      ...ownerHeaders,
      ...(init.headers || {})
    }
  });
}

function context() {
  return {
    requestId: 'request-1',
    traceId: 'trace-1',
    identity: {
      authenticated: true,
      ownerConfigured: true,
      ownerAuthorised: true,
      email: 'owner@example.com',
      source: 'cloudflare-access',
      assurance: 'cloudflare-access-policy-dependent'
    },
    tenant: {
      tenantId: 'owner',
      mode: 'private-owner-single-tenant',
      publicRegistration: false,
      tenantWritesEnabled: false,
      ownerAuthorised: true
    }
  };
}

test('runtime release is explicit', () => {
  assert.equal(RUNTIME_WAVE_1_RELEASE, 'runtime-wave-1.0.0');
});

test('Cloudflare Access identity requires both email and JWT', () => {
  const identity = accessIdentity(
    ownerRequest('https://example.com'),
    { OWNER_EMAIL: 'owner@example.com' }
  );
  assert.equal(identity.authenticated, true);
  assert.equal(identity.ownerAuthorised, true);
});

test('spoofed email without Access JWT is rejected', () => {
  const identity = accessIdentity(
    new Request('https://example.com', {
      headers: { 'cf-access-authenticated-user-email': 'owner@example.com' }
    }),
    { OWNER_EMAIL: 'owner@example.com' }
  );
  assert.equal(identity.authenticated, false);
  assert.equal(identity.ownerAuthorised, false);
});

test('non-owner Access identity is denied', () => {
  const identity = accessIdentity(
    new Request('https://example.com', {
      headers: {
        'cf-access-authenticated-user-email': 'other@example.com',
        'cf-access-jwt-assertion': 'verified'
      }
    }),
    { OWNER_EMAIL: 'owner@example.com' }
  );
  assert.equal(requireOwner(identity).code, 'OWNER_ACCESS_DENIED');
});

test('masked email does not expose full local part', () => {
  assert.equal(maskedEmail('sakthivel@example.com'), 'sa***@example.com');
});

test('tenant IDs are normalised and constrained', () => {
  assert.equal(normaliseTenantId(' OWNER_Project '), 'owner_project');
  assert.equal(normaliseTenantId('../escape'), '');
});

test('Wave 1 resolves a private owner tenant', () => {
  const identity = {
    ownerAuthorised: true
  };
  const tenant = resolveTenantContext(
    new Request('https://example.com', {
      headers: { 'x-sakthi-tenant': 'owner' }
    }),
    identity
  );
  assert.equal(tenant.tenantId, 'owner');
  assert.equal(tenant.tenantWritesEnabled, false);
});

test('cross-tenant access is denied', () => {
  assert.equal(
    enforceTenantBoundary('owner', 'customer-a').code,
    'CROSS_TENANT_ACCESS_DENIED'
  );
});

test('policy action list contains only bounded Wave 1 actions', () => {
  assert.equal(RUNTIME_WAVE_1_ACTIONS.includes('runtime:policy:evaluate'), true);
  assert.equal(RUNTIME_WAVE_1_ACTIONS.some((value) => /delete|deploy/.test(value)), false);
});

test('policy allows approved owner dry-run action', () => {
  const decision = evaluateRuntimePolicy(context(), {
    action: 'runtime:policy:evaluate',
    tenantId: 'owner',
    riskScore: 20
  });
  assert.equal(decision.allowed, true);
  assert.equal(decision.productionWriteAllowed, false);
});

test('policy denies unknown and mutating actions', () => {
  const decision = evaluateRuntimePolicy(context(), {
    action: 'runtime:data:delete',
    tenantId: 'owner',
    riskScore: 20
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.reasons.includes('action_not_allowlisted'), true);
});

test('policy denies a high-risk request', () => {
  const decision = evaluateRuntimePolicy(context(), {
    action: 'runtime:context:read',
    tenantId: 'owner',
    riskScore: 80
  });
  assert.equal(decision.allowed, false);
  assert.equal(
    decision.reasons.includes('risk_score_exceeds_wave_1_threshold'),
    true
  );
});

test('secret detection identifies credential-shaped prompt data', () => {
  assert.equal(containsRuntimeSecret('api_key=abcdef'), true);
  assert.equal(containsRuntimeSecret('Explain Azure Arc'), false);
});

test('AI envelope is free-first and does not return prompt content', async () => {
  const result = await createAiRequestEnvelope({
    prompt: 'Explain tenant isolation',
    mode: 'coding',
    budget: 'balanced',
    purpose: 'owner-test'
  }, context(), {
    PREMIUM_PROVIDERS_ENABLED: 'false',
    PAID_PROVIDER_OWNER_APPROVAL: 'NOT_APPROVED'
  });

  assert.equal(result.valid, true);
  assert.equal(result.envelope.provider, 'workers-ai');
  assert.equal(result.envelope.promptStored, false);
  assert.equal('prompt' in result.envelope, false);
  assert.equal(result.envelope.promptSha256.length, 64);
});

test('AI envelope rejects secrets', async () => {
  const result = await createAiRequestEnvelope({
    prompt: 'password=super-secret-value'
  }, context(), {});
  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('secret_detected'), true);
});

test('SHA-256 utility is deterministic', async () => {
  assert.equal(await sha256('sakthiai'), await sha256('sakthiai'));
  assert.notEqual(await sha256('sakthiai'), await sha256('SakthiAI'));
});

test('output safety blocks private keys', () => {
  const result = assessOutputSafety(
    '-----BEGIN PRIVATE KEY----- secret material'
  );
  assert.equal(result.allowed, false);
  assert.equal(
    result.findings.some((item) => item.code === 'SECRET_DISCLOSURE_RISK'),
    true
  );
});

test('output safety requests review for PII', () => {
  const result = assessOutputSafety('Contact test@example.com for details.');
  assert.equal(result.allowed, true);
  assert.equal(result.requiresHumanReview, true);
});

test('output safety requests review for unsupported certification claims', () => {
  const result = assessOutputSafety('The platform is fully compliant and certified.');
  assert.equal(result.requiresHumanReview, true);
});

test('observability snapshot excludes sensitive content', () => {
  const snapshot = runtimeObservabilitySnapshot({
    AI: {},
    ASSETS: {},
    OWNER_EMAIL: 'owner@example.com',
    RUNTIME_WAVE1_ENABLED: 'false'
  });
  assert.equal(snapshot.sensitiveContentIncluded, false);
  assert.equal(snapshot.controls.productionWritesEnabled, false);
  assert.equal(snapshot.state, 'disabled-by-default');
});

test('status endpoint is safe while disabled', async () => {
  const response = await handleRuntimeWave1(
    new Request('https://example.com/api/v1/runtime/status'),
    {},
    new URL('https://example.com/api/v1/runtime/status')
  );
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.enabled, false);
  assert.equal(body.productionWritesEnabled, false);
});

test('private endpoint requires Access authentication', async () => {
  const response = await handleRuntimeWave1(
    new Request('https://example.com/api/v1/runtime/context'),
    { RUNTIME_WAVE1_ENABLED: 'true', OWNER_EMAIL: 'owner@example.com' },
    new URL('https://example.com/api/v1/runtime/context')
  );
  assert.equal(response.status, 401);
});

test('owner context endpoint works only when enabled', async () => {
  const response = await handleRuntimeWave1(
    ownerRequest('https://example.com/api/v1/runtime/context'),
    { RUNTIME_WAVE1_ENABLED: 'true', OWNER_EMAIL: 'owner@example.com' },
    new URL('https://example.com/api/v1/runtime/context')
  );
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.identity.ownerAuthorised, true);
  assert.equal(body.tenant.tenantWritesEnabled, false);
});

test('owner policy evaluation route executes a dry-run decision', async () => {
  const request = ownerRequest(
    'https://example.com/api/v1/runtime/policy/evaluate',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'runtime:policy:evaluate',
        tenantId: 'owner',
        riskScore: 10
      })
    }
  );
  const response = await handleRuntimeWave1(
    request,
    { RUNTIME_WAVE1_ENABLED: 'true', OWNER_EMAIL: 'owner@example.com' },
    new URL(request.url)
  );
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.decision.allowed, true);
  assert.equal(body.decision.productionWriteAllowed, false);
});

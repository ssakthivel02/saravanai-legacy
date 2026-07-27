import test from 'node:test';
import assert from 'node:assert/strict';
import {
  accessJwtEnforcementEnabled,
  enforceAccessJwt,
  isPublicAccessPath,
  verifyAccessJwt
} from '../src/access-jwt.js';

const encoder = new TextEncoder();
const now = 1_800_000_000;

function base64url(value) {
  const bytes = typeof value === 'string' ? encoder.encode(value) : new Uint8Array(value);
  return Buffer.from(bytes).toString('base64url');
}

async function fixture() {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );
  const publicJwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  publicJwk.kid = 'test-key';
  publicJwk.alg = 'RS256';
  publicJwk.use = 'sig';

  async function token(payloadOverrides = {}, headerOverrides = {}) {
    const header = { alg: 'RS256', typ: 'JWT', kid: 'test-key', ...headerOverrides };
    const payload = {
      iss: 'https://sakthiai.cloudflareaccess.com',
      aud: ['sakthiai-audience'],
      sub: 'subject-1',
      email: 'owner@example.com',
      iat: now - 60,
      nbf: now - 60,
      exp: now + 3600,
      ...payloadOverrides
    };
    const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, encoder.encode(signingInput));
    return `${signingInput}.${base64url(signature)}`;
  }

  return { jwks: { keys: [publicJwk] }, token };
}

const env = {
  ACCESS_JWT_ENFORCEMENT_ENABLED: 'true',
  ACCESS_TEAM_DOMAIN: 'https://sakthiai.cloudflareaccess.com',
  ACCESS_AUD: 'sakthiai-audience',
  OWNER_EMAIL: 'owner@example.com',
  ACCESS_ALLOWED_EMAILS: 'member@example.com'
};

test('enforcement is disabled unless explicitly enabled', () => {
  assert.equal(accessJwtEnforcementEnabled({}), false);
  assert.equal(accessJwtEnforcementEnabled({ ACCESS_JWT_ENFORCEMENT_ENABLED: 'true' }), true);
});

test('only minimal health and runtime status paths bypass the internal JWT guard', () => {
  assert.equal(isPublicAccessPath('/health'), true);
  assert.equal(isPublicAccessPath('/api/v1/runtime/programme/status'), true);
  assert.equal(isPublicAccessPath('/api/v1/runtime/v1/status'), true);
  assert.equal(isPublicAccessPath('/api/v1/runtime/v50/status'), true);
  assert.equal(isPublicAccessPath('/api/v1/platform/session'), false);
  assert.equal(isPublicAccessPath('/'), false);
});

test('valid owner token is signature, issuer, audience and allow-list verified', async () => {
  const { jwks, token } = await fixture();
  const jwt = await token();
  const request = new Request('https://example.test/api/v1/platform/session', {
    headers: { 'cf-access-authenticated-user-email': 'owner@example.com' }
  });
  const result = await verifyAccessJwt(jwt, request, env, { jwks, nowSeconds: now });
  assert.equal(result.valid, true);
  assert.equal(result.identity.role, 'owner');
  assert.match(result.identity.profileKey, /^profile-[a-f0-9]{24}$/);
  assert.equal(result.identity.assurance, 'cloudflare-access-jwt-rs256-verified');
});

test('allowed non-owner receives member role and isolated profile key', async () => {
  const { jwks, token } = await fixture();
  const jwt = await token({ email: 'member@example.com', sub: 'subject-2' });
  const request = new Request('https://example.test/api/v1/platform/session', {
    headers: { 'cf-access-authenticated-user-email': 'member@example.com' }
  });
  const result = await verifyAccessJwt(jwt, request, env, { jwks, nowSeconds: now });
  assert.equal(result.valid, true);
  assert.equal(result.identity.role, 'member');
  assert.notEqual(result.identity.profileKey, null);
});

test('unlisted email is denied even when the JWT is valid', async () => {
  const { jwks, token } = await fixture();
  const jwt = await token({ email: 'attacker@example.com' });
  const request = new Request('https://example.test/private', {
    headers: { 'cf-access-authenticated-user-email': 'attacker@example.com' }
  });
  const result = await verifyAccessJwt(jwt, request, env, { jwks, nowSeconds: now });
  assert.equal(result.valid, false);
  assert.equal(result.status, 403);
  assert.equal(result.code, 'ACCESS_EMAIL_NOT_ALLOWED');
});

test('wrong audience, expired token and email-header mismatch are rejected', async () => {
  const { jwks, token } = await fixture();
  const request = new Request('https://example.test/private', {
    headers: { 'cf-access-authenticated-user-email': 'owner@example.com' }
  });

  const wrongAudience = await verifyAccessJwt(await token({ aud: ['wrong'] }), request, env, { jwks, nowSeconds: now });
  assert.equal(wrongAudience.code, 'ACCESS_JWT_AUDIENCE_MISMATCH');

  const expired = await verifyAccessJwt(await token({ exp: now - 1 }), request, env, { jwks, nowSeconds: now });
  assert.equal(expired.code, 'ACCESS_JWT_EXPIRED');

  const mismatch = await verifyAccessJwt(await token({ email: 'member@example.com' }), request, env, { jwks, nowSeconds: now });
  assert.equal(mismatch.code, 'ACCESS_IDENTITY_HEADER_MISMATCH');
});

test('guard is a no-op while disabled and blocks a protected path when enabled without a JWT', async () => {
  const request = new Request('https://example.test/api/v1/platform/session');
  const disabled = await enforceAccessJwt(request, {}, new URL(request.url));
  assert.equal(disabled.enforced, false);
  assert.equal(disabled.response, null);

  const blocked = await enforceAccessJwt(request, env, new URL(request.url));
  assert.equal(blocked.enforced, true);
  assert.equal(blocked.response.status, 401);
  assert.equal((await blocked.response.json()).code, 'ACCESS_JWT_MISSING');
});

test('guard forwards only verified identity headers', async () => {
  const { jwks, token } = await fixture();
  const jwt = await token();
  const request = new Request('https://example.test/api/v1/platform/session', {
    headers: {
      'cf-access-jwt-assertion': jwt,
      'cf-access-authenticated-user-email': 'owner@example.com',
      'x-sakthiai-access-verified': 'spoofed'
    }
  });
  const guarded = await enforceAccessJwt(request, env, new URL(request.url), { jwks, nowSeconds: now });
  assert.equal(guarded.response, null);
  assert.equal(guarded.request.headers.get('x-sakthiai-access-verified'), 'true');
  assert.equal(guarded.request.headers.get('x-sakthiai-access-role'), 'owner');
  assert.match(guarded.request.headers.get('x-sakthiai-profile-key'), /^profile-/);
});

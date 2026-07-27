import test from 'node:test';
import assert from 'node:assert/strict';
import { accessRouteAuthorisationEnabled, enforceRouteAuthorisation } from '../src/access-authorizer.js';

const enabledEnv = { ACCESS_ROUTE_AUTHORIZATION_ENABLED: 'true' };

function verifiedRequest(path, method, role) {
  return new Request(`https://example.test${path}`, {
    method,
    headers: { 'x-sakthiai-access-verified': 'true', 'x-sakthiai-access-role': role }
  });
}

test('route authorisation is disabled unless explicitly enabled', async () => {
  assert.equal(accessRouteAuthorisationEnabled({}), false);
  const request = new Request('https://example.test/api/v1/chat', { method: 'POST' });
  const result = await enforceRouteAuthorisation(request, {}, new URL(request.url));
  assert.equal(result.enforced, false);
  assert.equal(result.response, null);
  assert.equal(result.audit.decision, 'bypass-disabled');
});

test('public status remains available when route authorisation is enabled', async () => {
  const request = new Request('https://example.test/health');
  const result = await enforceRouteAuthorisation(request, enabledEnv, new URL(request.url));
  assert.equal(result.enforced, true);
  assert.equal(result.response, null);
  assert.equal(result.request.headers.get('x-sakthiai-authorisation-role'), 'public');
});

test('verified owner and member can use AI work routes but reader cannot', async () => {
  for (const role of ['owner', 'member']) {
    const request = verifiedRequest('/api/v1/chat', 'POST', role);
    const result = await enforceRouteAuthorisation(request, enabledEnv, new URL(request.url));
    assert.equal(result.response, null);
    assert.equal(result.audit.decision, 'allow');
  }
  const reader = verifiedRequest('/api/v1/chat', 'POST', 'reader');
  const denied = await enforceRouteAuthorisation(reader, enabledEnv, new URL(reader.url));
  assert.equal(denied.response.status, 403);
  assert.equal((await denied.response.json()).code, 'ACCESS_ROLE_NOT_AUTHORISED');
});

test('owner security routes require a verified owner', async () => {
  const member = verifiedRequest('/api/v1/platform/access/authorisation', 'GET', 'member');
  const denied = await enforceRouteAuthorisation(member, enabledEnv, new URL(member.url));
  assert.equal(denied.response.status, 403);
  const owner = verifiedRequest('/api/v1/platform/access/authorisation', 'GET', 'owner');
  const allowed = await enforceRouteAuthorisation(owner, enabledEnv, new URL(owner.url));
  assert.equal(allowed.response, null);
});

test('server mutation routes remain disabled behind a separate gate', async () => {
  const request = verifiedRequest('/api/v1/files/upload', 'POST', 'owner');
  const denied = await enforceRouteAuthorisation(request, enabledEnv, new URL(request.url));
  assert.equal(denied.response.status, 503);
  assert.equal((await denied.response.json()).code, 'ACCESS_SERVER_MUTATIONS_DISABLED');
  const allowed = await enforceRouteAuthorisation(request, {
    ...enabledEnv,
    ACCESS_SERVER_MUTATIONS_ENABLED: 'true'
  }, new URL(request.url));
  assert.equal(allowed.response, null);
});

test('unclassified routes and unverified identities fail closed', async () => {
  const unknown = verifiedRequest('/api/v1/unknown', 'GET', 'owner');
  const unknownResult = await enforceRouteAuthorisation(unknown, enabledEnv, new URL(unknown.url));
  assert.equal(unknownResult.response.status, 403);
  assert.equal((await unknownResult.response.json()).code, 'ACCESS_ROUTE_UNCLASSIFIED');
  const unverified = new Request('https://example.test/api/v1/chat', { method: 'POST' });
  const unverifiedResult = await enforceRouteAuthorisation(unverified, enabledEnv, new URL(unverified.url));
  assert.equal(unverifiedResult.response.status, 401);
});

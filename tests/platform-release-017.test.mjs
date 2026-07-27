import test from 'node:test';
import assert from 'node:assert/strict';
import { build017AuthorisationContract, handleBuild017PlatformApi, PLATFORM_RELEASE_017 } from '../src/platform-release-017.js';

test('Build 017 authorisation contract is prepared and disabled by default', () => {
  const request = new Request('https://example.test/api/v1/platform/access/authorisation');
  const contract = build017AuthorisationContract(request, {});
  assert.equal(contract.endpointAuthorisationEnabled, false);
  assert.equal(contract.serverMutationsEnabled, false);
  assert.equal(contract.defaultDenyReady, true);
  assert.equal(contract.serverWritesAllowed, false);
});

test('Build 017 authorisation endpoint exposes no identity secrets', async () => {
  const request = new Request('https://example.test/api/v1/platform/access/authorisation', {
    headers: {
      'x-sakthiai-access-verified': 'true',
      'x-sakthiai-access-role': 'owner',
      'x-sakthiai-access-email': 'owner@example.com',
      'cf-access-jwt-assertion': 'secret.jwt.value'
    }
  });
  const response = await handleBuild017PlatformApi(request, {}, new URL(request.url));
  const payload = await response.json();
  assert.equal(payload.platformRelease, PLATFORM_RELEASE_017);
  assert.equal(payload.currentSession.role, 'owner');
  const serialized = JSON.stringify(payload);
  assert.equal(serialized.includes('owner@example.com'), false);
  assert.equal(serialized.includes('secret.jwt.value'), false);
  assert.equal(payload.boundaries.auditPersistenceEnabled, false);
});

test('wrapped platform release reports Build 017 without changing the legacy component history', async () => {
  const request = new Request('https://example.test/api/v1/platform/release');
  const response = await handleBuild017PlatformApi(request, {}, new URL(request.url));
  const payload = await response.json();
  assert.equal(payload.platformRelease, '0.17.0-endpoint-authorisation');
  assert.equal(payload.ownerBuild, 17);
  assert.equal(payload.activation.endpointAuthorisationEnabled, false);
  assert.equal(payload.activation.serverRoleEnforcementEnabled, false);
  assert.equal(payload.activation.serverWritesAllowed, false);
});

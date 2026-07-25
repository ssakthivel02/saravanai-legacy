import test from 'node:test';
import assert from 'node:assert/strict';
import { governanceSnapshot, handleGovernance } from '../src/governance.js';

const origin = 'https://sakthiai.omsaravanabhava.org';

function request(path, headers = {}) {
  return new Request(`${origin}${path}`, { headers });
}

test('governance snapshot keeps public and paid operation disabled', () => {
  const snapshot = governanceSnapshot({});
  assert.equal(snapshot.release, '0.20.0-governance-foundation');
  assert.equal(snapshot.publicRegistration, false);
  assert.equal(snapshot.commercialProvidersEnabled, false);
  assert.equal(snapshot.certificationClaims, false);
  assert.equal(snapshot.releases.length, 9);
  assert.equal(snapshot.pillars.length, 8);
  assert.ok(snapshot.hardGates.some((gate) => gate.includes('No public registration')));
});

test('framework endpoint never claims certification', async () => {
  const response = handleGovernance(request('/api/v1/governance/frameworks'), {}, new URL(`${origin}/api/v1/governance/frameworks`));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.certificationClaims, false);
  assert.ok(body.frameworks.every((framework) => framework.certificationClaim === false));
});

test('server tenant writes need both D1 and explicit activation', () => {
  assert.equal(governanceSnapshot({ SAKTHI_DB: {} }).serverTenantWritesEnabled, false);
  assert.equal(governanceSnapshot({ SAKTHI_DB: {}, PUBLIC_TENANT_WRITES: 'true' }).serverTenantWritesEnabled, true);
});

test('owner write authorisation requires verified Access headers and matching owner email', async () => {
  const url = new URL(`${origin}/api/v1/governance/access`);
  const unauthenticated = handleGovernance(request('/api/v1/governance/access'), { OWNER_EMAIL: 'owner@example.com' }, url);
  assert.equal((await unauthenticated.json()).ownerWriteAuthorised, false);

  const authenticated = handleGovernance(request('/api/v1/governance/access', {
    'cf-access-authenticated-user-email': 'owner@example.com',
    'cf-access-jwt-assertion': 'verified-upstream-token'
  }), { OWNER_EMAIL: 'owner@example.com' }, url);
  const body = await authenticated.json();
  assert.equal(body.identity.authenticated, true);
  assert.equal(body.ownerWriteAuthorised, true);
  assert.equal(body.publicRegistration, false);
});

test('governance API rejects write methods', async () => {
  const url = new URL(`${origin}/api/v1/governance`);
  const response = handleGovernance(new Request(url, { method: 'POST' }), {}, url);
  assert.equal(response.status, 405);
  assert.equal((await response.json()).code, 'METHOD_NOT_ALLOWED');
});

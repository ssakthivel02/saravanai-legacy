import test from 'node:test';
import assert from 'node:assert/strict';
import { handleOwnerApi, __test } from '../src/owner-api.js';

const { platformReleaseContract } = __test;

test('platform release contract keeps paid fallback, public registration and invitations disabled', () => {
  const contract = platformReleaseContract({ accessJwtEnforcement: false });
  assert.equal(contract.platformRelease, '0.15.0-access-readiness');
  assert.equal(contract.ownerBuild, 15);
  assert.equal(contract.activation.publicRegistration, false);
  assert.equal(contract.activation.readerProfilesEnabled, false);
  assert.equal(contract.activation.memberInvitationsEnabled, false);
  assert.equal(contract.usagePolicy.paidFallbackEnabled, false);
  assert.equal(contract.usagePolicy.serverHardQuotaEnabled, false);
});

test('platform release endpoint reports manual activation while JWT enforcement is disabled', async () => {
  const request = new Request('https://sakthiai.example/api/v1/platform/release');
  const response = await handleOwnerApi(request, {}, new URL(request.url));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.platformRelease, '0.15.0-access-readiness');
  assert.equal(data.activation.ownerAccessPilot, 'manual-cloudflare-activation-required');
  assert.equal(data.usagePolicy.browserSoftCapDefault, 50);
});

test('platform release endpoint distinguishes active Worker JWT enforcement', async () => {
  const request = new Request('https://sakthiai.example/api/v1/platform/release');
  const response = await handleOwnerApi(request, { ACCESS_JWT_ENFORCEMENT_ENABLED: 'true' }, new URL(request.url));
  const data = await response.json();
  assert.equal(data.activation.accessJwtEnforcementEnabled, true);
  assert.equal(data.activation.ownerAccessPilot, 'worker-jwt-enforcement-active');
});

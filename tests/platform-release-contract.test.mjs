import test from 'node:test';
import assert from 'node:assert/strict';
import { handleOwnerApi, __test } from '../src/owner-api.js';

const { platformReleaseContract } = __test;

const ownerEnv = { OWNER_EMAIL: 'owner@example.com' };

test('platform release contract keeps paid fallback, public registration and team profiles disabled', () => {
  const contract = platformReleaseContract({ accessJwtEnforcement: false }, ownerEnv);
  assert.equal(contract.platformRelease, '0.16.0-role-policy');
  assert.equal(contract.ownerBuild, 16);
  assert.equal(contract.activation.publicRegistration, false);
  assert.equal(contract.activation.readerProfilesEnabled, false);
  assert.equal(contract.activation.teamProfilesEnabled, false);
  assert.equal(contract.activation.memberInvitationsEnabled, false);
  assert.equal(contract.activation.invitationRequestsActive, false);
  assert.equal(contract.usagePolicy.paidFallbackEnabled, false);
  assert.equal(contract.usagePolicy.serverHardQuotaEnabled, false);
  assert.equal(contract.components.accessRolePolicy, 'access-role-policy-foundation-1.0.0');
});

test('platform release endpoint reports manual activation while JWT enforcement is disabled', async () => {
  const request = new Request('https://sakthiai.example/api/v1/platform/release');
  const response = await handleOwnerApi(request, ownerEnv, new URL(request.url));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.platformRelease, '0.16.0-role-policy');
  assert.equal(data.activation.ownerAccessPilot, 'manual-cloudflare-activation-required');
  assert.equal(data.activation.accessRolePolicyValid, true);
  assert.equal(data.usagePolicy.browserSoftCapDefault, 50);
});

test('platform release endpoint distinguishes active Worker JWT enforcement', async () => {
  const request = new Request('https://sakthiai.example/api/v1/platform/release');
  const response = await handleOwnerApi(request, { ...ownerEnv, ACCESS_JWT_ENFORCEMENT_ENABLED: 'true' }, new URL(request.url));
  const data = await response.json();
  assert.equal(data.activation.accessJwtEnforcementEnabled, true);
  assert.equal(data.activation.ownerAccessPilot, 'worker-jwt-enforcement-active');
});

test('access readiness endpoint exposes safe role counts and no identity secrets', async () => {
  const request = new Request('https://sakthiai.example/api/v1/platform/access/readiness', {
    headers: {
      'x-sakthiai-access-verified': 'true',
      'x-sakthiai-access-email': 'owner@example.com',
      'x-sakthiai-access-role': 'owner',
      'x-sakthiai-profile-key': 'profile-0123456789abcdef01234567'
    }
  });
  const response = await handleOwnerApi(request, {
    ...ownerEnv,
    ACCESS_JWT_ENFORCEMENT_ENABLED: 'true',
    ACCESS_MEMBER_EMAILS: 'member@example.com',
    ACCESS_READER_EMAILS: 'reader@example.com'
  }, new URL(request.url));
  const data = await response.json();
  const serialized = JSON.stringify(data);
  assert.equal(data.accessPolicy.configuredProfileCounts.owner, 1);
  assert.equal(data.accessPolicy.configuredProfileCounts.member, 1);
  assert.equal(data.accessPolicy.configuredProfileCounts.reader, 1);
  assert.equal(data.currentSession.role, 'owner');
  assert.equal(data.currentSession.profileIsolationReady, true);
  assert.equal(data.boundaries.fullEmailExposed, false);
  assert.equal(data.boundaries.profileKeyExposed, false);
  assert.doesNotMatch(serialized, /owner@example\.com|member@example\.com|reader@example\.com|profile-0123/);
});

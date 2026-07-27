import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCESS_POLICY_RELEASE,
  accessPolicySummary,
  capabilitiesForRole,
  compileAccessPolicy,
  resolveConfiguredRole
} from '../src/access-policy.js';

test('owner-only policy is valid and duplicate owner entries do not create a second role', () => {
  const policy = compileAccessPolicy({
    OWNER_EMAIL: 'owner@example.com',
    ACCESS_ALLOWED_EMAILS: 'owner@example.com'
  });
  assert.equal(policy.valid, true);
  assert.equal(policy.ownerConfigured, true);
  assert.equal(policy.memberEmails.size, 0);
  assert.equal(policy.readerEmails.size, 0);
  assert.equal(policy.teamProfilesEnabled, false);
  assert.equal(policy.release, ACCESS_POLICY_RELEASE);
});

test('member and reader profiles remain disabled unless their explicit gates are enabled', () => {
  const env = {
    OWNER_EMAIL: 'owner@example.com',
    ACCESS_MEMBER_EMAILS: 'member@example.com',
    ACCESS_READER_EMAILS: 'reader@example.com'
  };
  assert.equal(resolveConfiguredRole('owner@example.com', env).role, 'owner');
  assert.equal(resolveConfiguredRole('member@example.com', env).code, 'ACCESS_TEAM_PROFILES_DISABLED');
  assert.equal(resolveConfiguredRole('reader@example.com', env).code, 'ACCESS_TEAM_PROFILES_DISABLED');

  const memberEnv = { ...env, ACCESS_TEAM_PROFILES_ENABLED: 'true' };
  assert.equal(resolveConfiguredRole('member@example.com', memberEnv).role, 'member');
  assert.equal(resolveConfiguredRole('reader@example.com', memberEnv).code, 'ACCESS_READER_PROFILES_DISABLED');

  const readerEnv = { ...memberEnv, ACCESS_READER_PROFILES_ENABLED: 'true' };
  assert.equal(resolveConfiguredRole('reader@example.com', readerEnv).role, 'reader');
});

test('invalid and conflicting role configuration fails closed', () => {
  const policy = compileAccessPolicy({
    OWNER_EMAIL: 'owner@example.com',
    ACCESS_MEMBER_EMAILS: 'same@example.com,not-an-email',
    ACCESS_READER_EMAILS: 'same@example.com'
  });
  assert.equal(policy.valid, false);
  assert.equal(policy.invalidEntryCount, 1);
  assert.equal(policy.roleConflictCount, 1);
  assert.equal(resolveConfiguredRole('owner@example.com', {
    OWNER_EMAIL: 'owner@example.com',
    ACCESS_MEMBER_EMAILS: 'same@example.com',
    ACCESS_READER_EMAILS: 'same@example.com'
  }).code, 'ACCESS_ROLE_POLICY_INVALID');
});

test('policy summary exposes only counts, activation and capability contracts', () => {
  const summary = accessPolicySummary({
    OWNER_EMAIL: 'owner@example.com',
    ACCESS_MEMBER_EMAILS: 'member@example.com',
    ACCESS_READER_EMAILS: 'reader@example.com'
  });
  const serialized = JSON.stringify(summary);
  assert.equal(summary.valid, true);
  assert.deepEqual(summary.configuredProfileCounts, { owner: 1, member: 1, reader: 1 });
  assert.equal(summary.activation.teamProfilesEnabled, false);
  assert.equal(summary.activation.readerProfilesEnabled, false);
  assert.equal(summary.activation.invitationRequestsActive, false);
  assert.equal(summary.activation.publicRegistration, false);
  assert.doesNotMatch(serialized, /owner@example\.com|member@example\.com|reader@example\.com/);
});

test('role capabilities preserve least privilege', () => {
  const owner = capabilitiesForRole('owner');
  const member = capabilitiesForRole('member');
  const reader = capabilitiesForRole('reader');
  assert.equal(owner.approvals, 'decide');
  assert.equal(member.approvals, 'request-only');
  assert.equal(reader.approvals, 'none');
  assert.equal(reader.workspace, 'disabled-until-read-only-routes');
  assert.equal(member.accessAdministration, 'none');
});

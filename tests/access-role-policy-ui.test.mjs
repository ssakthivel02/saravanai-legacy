import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveRolePolicyView } from '../assets/access-role-policy.js';

test('role policy view reports owner-first readiness without exposing addresses', () => {
  const view = deriveRolePolicyView({
    accessPolicy: {
      valid: true,
      configuredProfileCounts: { owner: 1, member: 0, reader: 0 },
      activation: {
        teamProfilesEnabled: false,
        readerProfilesEnabled: false,
        invitationRequestsActive: false,
        sharedPersistenceEnabled: false
      },
      validation: { invalidEntryCount: 0, roleConflictCount: 0 },
      nextGate: 'Complete the exact-email owner pilot.'
    },
    currentSession: { cryptographicallyVerified: false, role: 'local-owner' }
  });
  assert.equal(view.tone, 'ready');
  assert.equal(view.metrics.owner, '1 configured');
  assert.match(view.metrics.member, /disabled by default/);
  assert.equal(view.metrics.invitations, 'Disabled');
  assert.doesNotMatch(JSON.stringify(view), /@/);
});

test('role policy view warns when the fail-closed contract is invalid', () => {
  const view = deriveRolePolicyView({
    accessPolicy: {
      valid: false,
      configuredProfileCounts: { owner: 0, member: 1, reader: 1 },
      activation: {},
      validation: { invalidEntryCount: 1, roleConflictCount: 1 }
    }
  });
  assert.equal(view.tone, 'warning');
  assert.match(view.title, /requires correction/i);
  assert.match(view.metrics.validation, /1 invalid/);
});

test('verified session is represented by role only', () => {
  const view = deriveRolePolicyView({
    accessPolicy: {
      valid: true,
      configuredProfileCounts: { owner: 1, member: 0, reader: 0 },
      activation: {},
      validation: {}
    },
    currentSession: {
      cryptographicallyVerified: true,
      role: 'owner',
      maskedEmail: 'ss***@example.com'
    }
  });
  assert.match(view.summary, /owner session is cryptographically verified/i);
  assert.doesNotMatch(view.summary, /ss\*\*\*/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveAccessReadiness, platformReleaseLabel } from '../assets/access-readiness.js';

test('access readiness reports manual activation before JWT enforcement', () => {
  const state = deriveAccessReadiness(
    { identity: { authenticated: false, cryptographicallyVerified: false, enforcementEnabled: false } },
    { activation: { accessJwtEnforcementEnabled: false } }
  );
  assert.equal(state.state, 'activation-pending');
  assert.match(state.nextAction, /exact-email/i);
});

test('access readiness reports a verified owner without exposing a full email', () => {
  const state = deriveAccessReadiness({
    identity: {
      authenticated: true,
      cryptographicallyVerified: true,
      enforcementEnabled: true,
      role: 'owner',
      maskedEmail: 'ss***@example.com'
    }
  });
  assert.equal(state.state, 'verified-owner');
  assert.match(state.summary, /ss\*\*\*@example\.com/);
  assert.doesNotMatch(state.summary, /sakthivel@example\.com/);
});

test('access readiness distinguishes active enforcement from a verified session', () => {
  const state = deriveAccessReadiness(
    { identity: { authenticated: false, cryptographicallyVerified: false, enforcementEnabled: true } },
    { activation: { accessJwtEnforcementEnabled: true } }
  );
  assert.equal(state.state, 'authentication-required');
  assert.match(state.nextAction, /sign in/i);
});

test('platform release label separates owner build from component releases', () => {
  assert.equal(
    platformReleaseLabel({ platformRelease: '0.15.0-access-readiness', ownerBuild: 15 }),
    'Owner Build 15 · 0.15.0-access-readiness'
  );
});

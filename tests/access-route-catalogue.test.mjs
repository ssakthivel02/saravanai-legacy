import test from 'node:test';
import assert from 'node:assert/strict';
import { accessRouteCatalogueSummary, resolveAccessRoute } from '../src/access-route-catalogue.js';

test('catalogue classifies public status routes without exposing identity data', () => {
  const health = resolveAccessRoute('/health', 'GET');
  assert.equal(health.public, true);
  assert.equal(health.id, 'public-health');
  const summary = accessRouteCatalogueSummary();
  assert.equal(summary.defaultDecision, 'deny-unclassified-when-enabled');
  assert.equal(summary.exactEmailDataIncluded, false);
  assert.equal(summary.dynamicUserDataIncluded, false);
});

test('catalogue separates work, owner security and server mutation routes', () => {
  assert.deepEqual(resolveAccessRoute('/api/v1/chat', 'POST').roles, ['owner', 'member']);
  assert.deepEqual(resolveAccessRoute('/api/v1/platform/access/authorisation', 'GET').roles, ['owner']);
  assert.equal(resolveAccessRoute('/api/v1/files/upload', 'POST').serverMutation, true);
});

test('unclassified routes are fail-closed when enforcement is enabled', () => {
  const route = resolveAccessRoute('/api/v1/new/unknown', 'POST');
  assert.equal(route.id, 'unclassified-protected-route');
  assert.deepEqual(route.roles, []);
  assert.equal(route.serverMutation, true);
});

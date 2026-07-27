import test from 'node:test';
import assert from 'node:assert/strict';
import { accessAuditContractSummary, createAccessDecisionEvent } from '../src/access-audit-contract.js';

test('audit decision contract contains metadata only', () => {
  const event = createAccessDecisionEvent({
    requestId: 'request-1',
    routeId: 'ai-chat',
    method: 'post',
    role: 'member',
    decision: 'allow',
    code: 'ACCESS_ROUTE_AUTHORISED',
    classification: 'ai-execution'
  });
  assert.equal(event.method, 'POST');
  assert.equal(event.role, 'member');
  assert.equal(event.emailIncluded, false);
  assert.equal(event.tokenIncluded, false);
  assert.equal(event.profileKeyIncluded, false);
  assert.equal(event.persistence, 'none-contract-only');
});

test('audit summary keeps persistence and external logging disabled', () => {
  const summary = accessAuditContractSummary();
  assert.equal(summary.persistenceEnabled, false);
  assert.equal(summary.externalLoggingEnabled, false);
  assert.deepEqual(summary.identityFieldsProhibited, ['email', 'jwt', 'profileKey', 'subject']);
});

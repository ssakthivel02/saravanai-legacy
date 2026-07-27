import test from 'node:test';
import assert from 'node:assert/strict';
import { createAccessDenialResponse } from '../src/access-denial.js';

test('denial response is no-store and does not expose identity material', async () => {
  const request = new Request('https://example.test/private', {
    headers: { 'cf-ray': 'ray-123', 'x-sakthiai-access-email': 'owner@example.com' }
  });
  const response = createAccessDenialResponse(request, {
    status: 403,
    code: 'ACCESS_ROLE_NOT_AUTHORISED',
    routeId: 'owner-security-read'
  });
  assert.equal(response.status, 403);
  assert.match(response.headers.get('cache-control'), /no-store/);
  const body = await response.json();
  assert.equal(body.requestId, 'ray-123');
  assert.equal(JSON.stringify(body).includes('owner@example.com'), false);
  assert.equal(body.publicRegistration, false);
});

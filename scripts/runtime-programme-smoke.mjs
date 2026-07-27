import assert from 'node:assert/strict';
import worker from '../src/entry.js';

const origin = 'https://sakthiai.omsaravanabhava.org';
const paths = [
  '/health',
  '/api/v1/runtime/status',
  ...Array.from({ length: 49 }, (_, index) => `/api/v1/runtime/v${index + 2}/status`),
  '/api/v1/runtime/programme/status'
];

const dangerousKeys = new Set([
  'productionWritesEnabled',
  'databaseWritesEnabled',
  'repositoryWritesEnabled',
  'externalFetchEnabled',
  'externalCallsEnabled',
  'externalToolExecutionEnabled',
  'aiExecutionEnabled',
  'paidProvidersEnabled',
  'premiumProvidersEnabled',
  'billingEnabled',
  'paymentsEnabled',
  'publicRegistration',
  'publicRegistrationEnabled',
  'autonomousActionsEnabled'
]);

for (const path of paths) {
  const response = await worker.fetch(new Request(`${origin}${path}`), {}, {});
  assert.equal(response.status, 200, `${path} did not return HTTP 200`);
  const body = await response.json();
  assert.equal(body.status, 'ok', `${path} did not return status=ok`);
  for (const [key, value] of Object.entries(body)) {
    if (dangerousKeys.has(key)) assert.equal(value, false, `${path} returned unsafe ${key}=${value}`);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'enabled')) assert.equal(body.enabled, false, `${path} unexpectedly enabled`);
  if (Object.prototype.hasOwnProperty.call(body, 'emergencyStopped')) assert.equal(body.emergencyStopped, true, `${path} is not emergency-stopped`);
  if (Object.prototype.hasOwnProperty.call(body, 'operational')) assert.equal(body.operational, false, `${path} unexpectedly operational`);
}

console.log(`Runtime Programme smoke validation passed for ${paths.length} read-only endpoints.`);

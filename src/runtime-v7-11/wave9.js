import { array, bool, clean, createWaveHandler, number } from './core.js';

function apiContract(input = {}) {
  const findings = [];
  const title = clean(input.title, 160);
  const version = clean(input.version, 50);
  const paths = array(input.paths, 300).map((path, index) => {
    const route = clean(path?.route, 240);
    const method = clean(path?.method, 20).toUpperCase();
    const auth = clean(path?.auth, 50).toLowerCase();
    if (!route.startsWith('/')) findings.push(`path_${index}_route_invalid`);
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) findings.push(`path_${index}_method_invalid`);
    if (!['public-status', 'cloudflare-access', 'service-token'].includes(auth)) findings.push(`path_${index}_auth_invalid`);
    return { route, method, auth };
  });
  if (!title) findings.push('title_required');
  if (!/^\d+\.\d+\.\d+$/.test(version)) findings.push('semantic_version_required');
  if (!paths.length) findings.push('path_required');
  return { valid: findings.length === 0, findings, contract: { title, version, paths, published: false, gatewayChanged: false } };
}

function compatibilityCheck(input = {}) {
  const previous = input.previous && typeof input.previous === 'object' ? input.previous : {};
  const proposed = input.proposed && typeof input.proposed === 'object' ? input.proposed : {};
  const findings = [];
  const previousRequired = new Set(array(previous.required, 300).map(String));
  const proposedRequired = new Set(array(proposed.required, 300).map(String));
  for (const field of previousRequired) if (!proposedRequired.has(field)) findings.push(`required_field_removed:${field}`);
  const previousEnum = previous.enum && typeof previous.enum === 'object' ? previous.enum : {};
  const proposedEnum = proposed.enum && typeof proposed.enum === 'object' ? proposed.enum : {};
  for (const [key, values] of Object.entries(previousEnum)) {
    const next = new Set(array(proposedEnum[key], 300).map(String));
    for (const value of array(values, 300).map(String)) if (!next.has(value)) findings.push(`enum_value_removed:${key}:${value}`);
  }
  return { valid: true, findings, compatibility: { breaking: findings.length > 0, deploymentExecuted: false, schemaPublished: false } };
}

function quotaEvaluate(input = {}) {
  const requestsPerMinute = Math.floor(number(input.requestsPerMinute, 1, 100000, 60));
  const burst = Math.floor(number(input.burst, 1, 100000, requestsPerMinute));
  const anonymous = bool(input.anonymous);
  const findings = [];
  if (anonymous && requestsPerMinute > 60) findings.push('anonymous_quota_too_high');
  if (burst > requestsPerMinute * 5) findings.push('burst_ratio_too_high');
  return { valid: findings.length === 0, findings, quota: { requestsPerMinute, burst, applied: false, billingEnabled: false } };
}

function webhookValidate(input = {}) {
  const url = clean(input.url, 500);
  const events = array(input.events, 50).map((v) => clean(v, 100)).filter(Boolean);
  const secretConfigured = bool(input.secretConfigured);
  const findings = [];
  if (!url.startsWith('https://')) findings.push('https_required');
  if (/localhost|127\.0\.0\.1|169\.254\.169\.254|\.internal/i.test(url)) findings.push('private_or_metadata_target_denied');
  if (!events.length) findings.push('event_required');
  if (!secretConfigured) findings.push('webhook_secret_required');
  return { valid: findings.length === 0, findings, webhook: { url, events, sent: false, registered: false, secretStored: false } };
}

function idempotencyCheck(input = {}) {
  const keyRequired = bool(input.keyRequired);
  const ttlSeconds = Math.floor(number(input.ttlSeconds, 1, 86400, 3600));
  const method = clean(input.method, 20).toUpperCase();
  const findings = [];
  if (['POST', 'PUT', 'PATCH'].includes(method) && !keyRequired) findings.push('idempotency_key_required');
  if (ttlSeconds < 60) findings.push('idempotency_ttl_too_short');
  return { valid: findings.length === 0, findings, policy: { method, keyRequired, ttlSeconds, storageCreated: false, requestsExecuted: false } };
}

export const RUNTIME_WAVE_9_RELEASE = 'runtime-wave-9.0.0';
export const RUNTIME_WAVE_9_SIDE_EFFECTS = Object.freeze({
  externalCallsEnabled: false,
  webhooksSent: false,
  apiKeysCreated: false,
  quotasChanged: false,
  productionWritesEnabled: false,
  paidIntegrationServicesEnabled: false
});
const routes = {
  '/api/v1/runtime/v9/contracts/validate': apiContract,
  '/api/v1/runtime/v9/compatibility/check': compatibilityCheck,
  '/api/v1/runtime/v9/quota/evaluate': quotaEvaluate,
  '/api/v1/runtime/v9/webhook/validate': webhookValidate,
  '/api/v1/runtime/v9/idempotency/check': idempotencyCheck
};
export const handleRuntimeWave9 = createWaveHandler({
  wave: 9,
  release: RUNTIME_WAVE_9_RELEASE,
  mode: 'private-owner-api-integration-governance-only',
  sideEffects: RUNTIME_WAVE_9_SIDE_EFFECTS,
  routes
});
export const __testWave9 = { apiContract, compatibilityCheck, quotaEvaluate, webhookValidate, idempotencyCheck };

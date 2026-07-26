import { accessIdentity, maskedEmail, requireOwner } from './runtime/identity.js';
import { createAiRequestEnvelope } from './runtime/ai-envelope.js';
import { runtimeObservabilitySnapshot } from './runtime/observability.js';
import { assessOutputSafety } from './runtime/output-safety.js';
import { evaluateRuntimePolicy } from './runtime/policy.js';
import {
  booleanEnv,
  parseRuntimeJson,
  runtimeJson
} from './runtime/shared.js';
import { resolveTenantContext } from './runtime/tenant.js';

export const RUNTIME_WAVE_1_RELEASE = 'runtime-wave-1.0.0';

function runtimeEnabled(env = {}) {
  return booleanEnv(env.RUNTIME_WAVE1_ENABLED);
}

function runtimeContext(request, env, requestId) {
  const identity = accessIdentity(request, env);
  const tenant = resolveTenantContext(request, identity);
  return {
    requestId,
    traceId: request.headers.get('x-trace-id') || requestId,
    identity,
    tenant
  };
}

function ownerError(decision, requestId) {
  return runtimeJson({
    error: decision.reason,
    code: decision.code,
    publicRegistration: false
  }, decision.status, requestId);
}

export async function handleRuntimeWave1(request, env, url = new URL(request.url)) {
  const requestId = crypto.randomUUID();

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/status') {
    return runtimeJson({
      status: 'ok',
      release: RUNTIME_WAVE_1_RELEASE,
      enabled: runtimeEnabled(env),
      mode: 'private-owner-dry-run',
      publicRegistration: false,
      productionWritesEnabled: false,
      paidProvidersEnabled: false,
      activation: runtimeEnabled(env) ? 'owner-pilot' : 'disabled-by-default'
    }, 200, requestId);
  }

  const context = runtimeContext(request, env, requestId);
  const ownerDecision = requireOwner(context.identity);
  if (!ownerDecision.allowed) return ownerError(ownerDecision, requestId);

  if (!runtimeEnabled(env)) {
    return runtimeJson({
      error: 'Runtime Wave 1 is installed but disabled.',
      code: 'RUNTIME_WAVE_1_DISABLED',
      activation: 'Set RUNTIME_WAVE1_ENABLED=true only for an approved owner pilot.'
    }, 503, requestId);
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/context') {
    return runtimeJson({
      release: RUNTIME_WAVE_1_RELEASE,
      identity: {
        authenticated: context.identity.authenticated,
        ownerAuthorised: context.identity.ownerAuthorised,
        email: maskedEmail(context.identity.email),
        source: context.identity.source,
        assurance: context.identity.assurance
      },
      tenant: context.tenant,
      productionWriteAllowed: false
    }, 200, requestId);
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/observability') {
    return runtimeJson({
      release: RUNTIME_WAVE_1_RELEASE,
      snapshot: runtimeObservabilitySnapshot(env)
    }, 200, requestId);
  }

  if (request.method !== 'POST') {
    return runtimeJson({
      error: 'Method not allowed.',
      code: 'METHOD_NOT_ALLOWED'
    }, 405, requestId);
  }

  const parsed = await parseRuntimeJson(request, requestId);
  if (parsed.error) return parsed.error;

  if (url.pathname === '/api/v1/runtime/policy/evaluate') {
    const decision = evaluateRuntimePolicy(context, parsed.body, env);
    return runtimeJson({
      release: RUNTIME_WAVE_1_RELEASE,
      decision
    }, decision.allowed ? 200 : 403, requestId);
  }

  if (url.pathname === '/api/v1/runtime/ai/envelope') {
    const result = await createAiRequestEnvelope(parsed.body, context, env);
    return runtimeJson({
      release: RUNTIME_WAVE_1_RELEASE,
      ...result
    }, result.valid ? 200 : 422, requestId);
  }

  if (url.pathname === '/api/v1/runtime/ai/output/check') {
    const result = assessOutputSafety(parsed.body?.output);
    return runtimeJson({
      release: RUNTIME_WAVE_1_RELEASE,
      result
    }, result.allowed ? 200 : 422, requestId);
  }

  return runtimeJson({
    error: 'Runtime Wave 1 API route not found.',
    code: 'RUNTIME_ROUTE_NOT_FOUND'
  }, 404, requestId);
}

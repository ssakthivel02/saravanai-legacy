import { classifyApproval } from './runtime-v2/approval.js';
import { ownerBoundary, wave2State } from './runtime-v2/boundary.js';
import { inspectIdempotency } from './runtime-v2/idempotency.js';
import { createLeaseProposal } from './runtime-v2/lease.js';
import { wave2Observability } from './runtime-v2/observability.js';
import { compileBoundedPlan } from './runtime-v2/planner.js';
import { buildRollbackPlan } from './runtime-v2/rollback.js';
import { parseWave2Json, wave2Json } from './runtime-v2/shared.js';

export const RUNTIME_WAVE_2_RELEASE = 'runtime-wave-2.0.0';

function boundaryError(boundary, requestId) {
  return wave2Json({
    error: boundary.code === 'ACCESS_AUTHENTICATION_REQUIRED'
      ? 'Cloudflare Access authentication is required.'
      : boundary.code === 'OWNER_EMAIL_NOT_CONFIGURED'
        ? 'The owner identity boundary is not configured.'
        : 'The authenticated identity is not the configured owner.',
    code: boundary.code,
    publicRegistration: false
  }, boundary.status, requestId);
}

export async function handleRuntimeWave2(request, env, url = new URL(request.url)) {
  const requestId = crypto.randomUUID();
  const state = wave2State(env);

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v2/status') {
    return wave2Json({
      status: 'ok',
      release: RUNTIME_WAVE_2_RELEASE,
      ...state,
      mode: 'private-owner-plan-only',
      activation: state.operational ? 'owner-pilot' : 'disabled-or-emergency-stopped'
    }, 200, requestId);
  }

  const boundary = ownerBoundary(request, env);
  if (!boundary.allowed) return boundaryError(boundary, requestId);

  if (!state.enabled) {
    return wave2Json({
      error: 'Runtime Wave 2 is installed but disabled.',
      code: 'RUNTIME_WAVE_2_DISABLED'
    }, 503, requestId);
  }

  if (state.emergencyStopped) {
    return wave2Json({
      error: 'Runtime Wave 2 is under emergency stop.',
      code: 'RUNTIME_WAVE_2_EMERGENCY_STOPPED',
      recovery: 'Keep stopped until an approved owner review confirms safe reactivation.'
    }, 503, requestId);
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v2/emergency-stop') {
    return wave2Json({
      release: RUNTIME_WAVE_2_RELEASE,
      emergencyStopped: state.emergencyStopped,
      operational: state.operational,
      externalToolExecutionEnabled: false
    }, 200, requestId);
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v2/observability') {
    return wave2Json({ snapshot: wave2Observability(env) }, 200, requestId);
  }

  if (request.method !== 'POST') {
    return wave2Json({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }, 405, requestId);
  }

  const parsed = await parseWave2Json(request, requestId);
  if (parsed.error) return parsed.error;
  const context = { actor: boundary.actor, tenantId: boundary.tenantId, requestId };

  if (url.pathname === '/api/v1/runtime/v2/agent/plan') {
    const result = compileBoundedPlan(parsed.body);
    return wave2Json({ release: RUNTIME_WAVE_2_RELEASE, result }, result.valid ? 200 : 422, requestId);
  }

  if (url.pathname === '/api/v1/runtime/v2/tools/lease-proposal') {
    const result = createLeaseProposal(parsed.body, context);
    return wave2Json({ release: RUNTIME_WAVE_2_RELEASE, result }, result.valid ? 200 : 422, requestId);
  }

  if (url.pathname === '/api/v1/runtime/v2/approvals/classify') {
    const result = classifyApproval(parsed.body);
    return wave2Json({ release: RUNTIME_WAVE_2_RELEASE, result }, result.valid ? 200 : 422, requestId);
  }

  if (url.pathname === '/api/v1/runtime/v2/rollback/plan') {
    const result = buildRollbackPlan(parsed.body);
    return wave2Json({ release: RUNTIME_WAVE_2_RELEASE, result }, result.valid ? 200 : 422, requestId);
  }

  if (url.pathname === '/api/v1/runtime/v2/idempotency/inspect') {
    const result = await inspectIdempotency(parsed.body);
    return wave2Json({ release: RUNTIME_WAVE_2_RELEASE, result }, result.valid ? 200 : 422, requestId);
  }

  return wave2Json({
    error: 'Runtime Wave 2 API route not found.',
    code: 'RUNTIME_WAVE_2_ROUTE_NOT_FOUND'
  }, 404, requestId);
}

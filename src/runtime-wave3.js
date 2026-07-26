import { ownerBoundary, wave3State } from './runtime-v3/boundary.js';
import { validateCitationSet } from './runtime-v3/citations.js';
import { analyseContradictions } from './runtime-v3/contradictions.js';
import { buildCorrectionPlan } from './runtime-v3/corrections.js';
import { buildEvidencePacket } from './runtime-v3/evidence.js';
import { wave3Observability } from './runtime-v3/observability.js';
import { quarantinePreview } from './runtime-v3/quarantine.js';
import { buildRetrievalPlan } from './runtime-v3/retrieval.js';
import { parseWave3Json, wave3Json } from './runtime-v3/shared.js';
import { validateSourceRecord } from './runtime-v3/source-policy.js';
import { verifyTemporalContext } from './runtime-v3/temporal.js';

export const RUNTIME_WAVE_3_RELEASE = 'runtime-wave-3.0.0';

function boundaryError(boundary, requestId) {
  return wave3Json({
    error: boundary.code === 'ACCESS_AUTHENTICATION_REQUIRED'
      ? 'Cloudflare Access authentication is required.'
      : boundary.code === 'OWNER_EMAIL_NOT_CONFIGURED'
        ? 'The owner identity boundary is not configured.'
        : 'The authenticated identity is not the configured owner.',
    code: boundary.code,
    publicRegistration: false
  }, boundary.status, requestId);
}

export async function handleRuntimeWave3(request, env, url = new URL(request.url)) {
  const requestId = crypto.randomUUID();
  const state = wave3State(env);

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v3/status') {
    return wave3Json({
      status: 'ok',
      release: RUNTIME_WAVE_3_RELEASE,
      ...state,
      mode: 'private-owner-validation-only',
      activation: state.operational ? 'owner-pilot' : 'disabled-or-emergency-stopped'
    }, 200, requestId);
  }

  const boundary = ownerBoundary(request, env);
  if (!boundary.allowed) return boundaryError(boundary, requestId);

  if (!state.enabled) {
    return wave3Json({
      error: 'Runtime Wave 3 is installed but disabled.',
      code: 'RUNTIME_WAVE_3_DISABLED'
    }, 503, requestId);
  }

  if (state.emergencyStopped) {
    return wave3Json({
      error: 'Runtime Wave 3 is under emergency stop.',
      code: 'RUNTIME_WAVE_3_EMERGENCY_STOPPED'
    }, 503, requestId);
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v3/observability') {
    return wave3Json({ snapshot: wave3Observability(env) }, 200, requestId);
  }

  if (request.method !== 'POST') {
    return wave3Json({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }, 405, requestId);
  }

  const parsed = await parseWave3Json(request, requestId);
  if (parsed.error) return parsed.error;

  const routes = new Map([
    ['/api/v1/runtime/v3/sources/validate', () => validateSourceRecord(parsed.body)],
    ['/api/v1/runtime/v3/ingestion/quarantine-preview', () => quarantinePreview(parsed.body)],
    ['/api/v1/runtime/v3/retrieval/plan', () => buildRetrievalPlan(parsed.body)],
    ['/api/v1/runtime/v3/citations/validate', () => validateCitationSet(parsed.body)],
    ['/api/v1/runtime/v3/contradictions/analyse', () => analyseContradictions(parsed.body)],
    ['/api/v1/runtime/v3/temporal/verify', () => verifyTemporalContext(parsed.body)],
    ['/api/v1/runtime/v3/evidence/package', () => buildEvidencePacket(parsed.body)],
    ['/api/v1/runtime/v3/corrections/plan', () => buildCorrectionPlan(parsed.body)]
  ]);

  const handler = routes.get(url.pathname);
  if (!handler) {
    return wave3Json({
      error: 'Runtime Wave 3 API route not found.',
      code: 'RUNTIME_WAVE_3_ROUTE_NOT_FOUND'
    }, 404, requestId);
  }

  const result = await handler();
  return wave3Json(
    { release: RUNTIME_WAVE_3_RELEASE, result },
    result.valid === false || result.acceptedForPreview === false ? 422 : 200,
    requestId
  );
}

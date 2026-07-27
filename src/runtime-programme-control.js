import {
  RUNTIME_PROGRAMME_RELEASE,
  RUNTIME_PROGRAMME_WAVE_COUNT
} from './runtime-programme/catalog.js';
import {
  accessBoundary,
  createSmokePlan,
  evaluateReleaseGate,
  html,
  json,
  parseJson,
  programmeSummary,
  rollbackPlan,
  smokeEndpoints,
  unsafeConfigurationFindings,
  validateEvidence,
  waveState
} from './runtime-programme/core.js';
import { renderControlCentre } from './runtime-programme/ui.js';

export { RUNTIME_PROGRAMME_RELEASE, RUNTIME_PROGRAMME_WAVE_COUNT };

export function runtimeProgrammeHealth(env = {}) {
  const summary = programmeSummary(env);
  return {
    runtimeProgrammeRelease: RUNTIME_PROGRAMME_RELEASE,
    runtimeProgrammeTotalWaves: summary.totalWaves,
    runtimeProgrammeOperationalWaves: summary.state.operationalCount,
    runtimeProgrammeSafetyStatus: summary.safety.status
  };
}

export async function handleRuntimeProgrammeControl(request, env, url = new URL(request.url)) {
  const requestId = crypto.randomUUID();
  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/programme/status') {
    const summary = programmeSummary(env);
    return json({
      status: 'ok',
      release: summary.release,
      programme: summary.programme,
      totalWaves: summary.totalWaves,
      enabledCount: summary.state.enabledCount,
      emergencyStoppedCount: summary.state.emergencyStoppedCount,
      operationalCount: summary.state.operationalCount,
      safetyStatus: summary.safety.status,
      publicRegistration: false,
      productionWritesEnabled: false,
      billingEnabled: false,
      paidProvidersEnabled: false,
      autonomousActionsEnabled: false
    }, 200, requestId);
  }

  const boundary = accessBoundary(request, env);
  if (!boundary.allowed) {
    return json({ error: boundary.code, code: boundary.code, publicRegistration: false }, boundary.status, requestId);
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/programme/control-centre') {
    return json({ status: 'ok', ...programmeSummary(env) }, 200, requestId);
  }
  if (request.method === 'GET' && url.pathname === '/runtime/control-centre') {
    return html(renderControlCentre(programmeSummary(env)), 200, requestId);
  }
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }, 405, requestId);
  }

  const parsed = await parseJson(request, requestId);
  if (parsed.error) return parsed.error;

  let result;
  if (url.pathname === '/api/v1/runtime/programme/evidence/validate') result = validateEvidence(parsed.body);
  else if (url.pathname === '/api/v1/runtime/programme/smoke/plan') result = createSmokePlan(parsed.body);
  else if (url.pathname === '/api/v1/runtime/programme/release/gate') result = evaluateReleaseGate(parsed.body, env);
  else if (url.pathname === '/api/v1/runtime/programme/rollback/plan') result = rollbackPlan(parsed.body);
  else return json({ error: 'Runtime programme route not found.', code: 'RUNTIME_PROGRAMME_ROUTE_NOT_FOUND' }, 404, requestId);

  return json({ status: result.valid ? 'ok' : 'review-required', release: RUNTIME_PROGRAMME_RELEASE, result }, result.valid ? 200 : 422, requestId);
}

export const __test = {
  accessBoundary,
  createSmokePlan,
  evaluateReleaseGate,
  programmeSummary,
  renderControlCentre,
  rollbackPlan,
  smokeEndpoints,
  unsafeConfigurationFindings,
  validateEvidence,
  waveState
};

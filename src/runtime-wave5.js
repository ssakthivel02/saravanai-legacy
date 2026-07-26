import { validateAlertPolicy } from './runtime-v5/alerting.js';
import { evaluateBurnRate } from './runtime-v5/burn-rate.js';
import { evaluateChangeRisk } from './runtime-v5/change-risk.js';
import { json, ownerBoundary, parseBody, runtimeState } from './runtime-v5/core.js';
import { buildRollbackPlan, evaluateDeploymentGate } from './runtime-v5/deployment.js';
import { buildSreEvidencePacket } from './runtime-v5/evidence.js';
import { aggregateHealth } from './runtime-v5/health.js';
import { triageIncident } from './runtime-v5/incident.js';
import { selectRunbook } from './runtime-v5/runbook.js';
import { evaluateSlo, validateSlo } from './runtime-v5/slo.js';
import { sanitizeTelemetry } from './runtime-v5/telemetry.js';

export const RUNTIME_WAVE_5_RELEASE = 'runtime-wave-5.0.0';

export async function handleRuntimeWave5(request, env, url = new URL(request.url)) {
  const requestId = crypto.randomUUID();
  const current = runtimeState(env);

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v5/status') {
    return json({
      status: 'ok',
      release: RUNTIME_WAVE_5_RELEASE,
      ...current,
      mode: 'private-owner-observability-sre-evaluation-only',
      activation: current.operational ? 'owner-pilot' : 'disabled-or-emergency-stopped'
    }, 200, requestId);
  }

  const boundary = ownerBoundary(request, env);
  if (!boundary.allowed) return json({ error: boundary.code, code: boundary.code, publicRegistration: false }, boundary.status, requestId);
  if (!current.enabled) return json({ error: 'Runtime Wave 5 is installed but disabled.', code: 'RUNTIME_WAVE_5_DISABLED' }, 503, requestId);
  if (current.emergencyStopped) return json({ error: 'Runtime Wave 5 is under emergency stop.', code: 'RUNTIME_WAVE_5_EMERGENCY_STOPPED' }, 503, requestId);
  if (request.method !== 'POST') return json({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }, 405, requestId);

  const parsed = await parseBody(request, requestId);
  if (parsed.error) return parsed.error;
  const routes = new Map([
    ['/api/v1/runtime/v5/slo/validate', () => validateSlo(parsed.body)],
    ['/api/v1/runtime/v5/slo/evaluate', () => evaluateSlo(parsed.body)],
    ['/api/v1/runtime/v5/burn-rate/evaluate', () => evaluateBurnRate(parsed.body)],
    ['/api/v1/runtime/v5/incidents/triage', () => triageIncident(parsed.body)],
    ['/api/v1/runtime/v5/changes/risk', () => evaluateChangeRisk(parsed.body)],
    ['/api/v1/runtime/v5/deployments/gate', () => evaluateDeploymentGate(parsed.body)],
    ['/api/v1/runtime/v5/rollbacks/plan', () => buildRollbackPlan(parsed.body)],
    ['/api/v1/runtime/v5/runbooks/select', () => selectRunbook(parsed.body)],
    ['/api/v1/runtime/v5/health/aggregate', () => aggregateHealth(parsed.body)],
    ['/api/v1/runtime/v5/alerts/validate', () => validateAlertPolicy(parsed.body)],
    ['/api/v1/runtime/v5/telemetry/sanitize', () => sanitizeTelemetry(parsed.body)],
    ['/api/v1/runtime/v5/evidence/packet', () => buildSreEvidencePacket(parsed.body)]
  ]);
  const handler = routes.get(url.pathname);
  if (!handler) return json({ error: 'Runtime Wave 5 API route not found.', code: 'RUNTIME_WAVE_5_ROUTE_NOT_FOUND' }, 404, requestId);
  const result = await handler();
  return json({ release: RUNTIME_WAVE_5_RELEASE, result }, result.valid === false ? 422 : 200, requestId);
}

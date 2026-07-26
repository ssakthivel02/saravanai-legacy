import { buildAuditEnvelope } from './runtime-v4/audit.js';
import { json, ownerBoundary, parseBody, state } from './runtime-v4/core.js';
import { validateClassification, validateExport, validateRetention } from './runtime-v4/governance.js';
import { validateMembership } from './runtime-v4/membership.js';
import { validateRole } from './runtime-v4/roles.js';
import { validateSharing } from './runtime-v4/sharing.js';
import { trustSnapshot, validateAccessibility } from './runtime-v4/trust.js';
import { validateWorkspace } from './runtime-v4/workspace.js';

export const RUNTIME_WAVE_4_RELEASE = 'runtime-wave-4.0.0';

export async function handleRuntimeWave4(request, env, url = new URL(request.url)) {
  const requestId = crypto.randomUUID();
  const current = state(env);

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v4/status') {
    return json({ status: 'ok', release: RUNTIME_WAVE_4_RELEASE, ...current, mode: 'private-owner-workspace-validation-only' }, 200, requestId);
  }

  const boundary = ownerBoundary(request, env);
  if (!boundary.allowed) return json({ error: boundary.code, code: boundary.code, publicRegistration: false }, boundary.status, requestId);
  if (!current.enabled) return json({ error: 'Runtime Wave 4 is installed but disabled.', code: 'RUNTIME_WAVE_4_DISABLED' }, 503, requestId);
  if (current.emergencyStopped) return json({ error: 'Runtime Wave 4 is under emergency stop.', code: 'RUNTIME_WAVE_4_EMERGENCY_STOPPED' }, 503, requestId);

  if (request.method === 'GET' && url.pathname === '/api/v1/runtime/v4/trust-centre') return json({ snapshot: trustSnapshot() }, 200, requestId);
  if (request.method !== 'POST') return json({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }, 405, requestId);

  const parsed = await parseBody(request, requestId);
  if (parsed.error) return parsed.error;
  const routes = new Map([
    ['/api/v1/runtime/v4/workspaces/validate', () => validateWorkspace(parsed.body)],
    ['/api/v1/runtime/v4/memberships/validate', () => validateMembership(parsed.body)],
    ['/api/v1/runtime/v4/roles/validate', () => validateRole(parsed.body)],
    ['/api/v1/runtime/v4/sharing/validate', () => validateSharing(parsed.body)],
    ['/api/v1/runtime/v4/classification/validate', () => validateClassification(parsed.body)],
    ['/api/v1/runtime/v4/exports/validate', () => validateExport(parsed.body)],
    ['/api/v1/runtime/v4/retention/validate', () => validateRetention(parsed.body)],
    ['/api/v1/runtime/v4/audit/envelope', () => buildAuditEnvelope(parsed.body)],
    ['/api/v1/runtime/v4/accessibility/validate', () => validateAccessibility(parsed.body)]
  ]);
  const handler = routes.get(url.pathname);
  if (!handler) return json({ error: 'Runtime Wave 4 API route not found.', code: 'RUNTIME_WAVE_4_ROUTE_NOT_FOUND' }, 404, requestId);
  const result = await handler();
  return json({ release: RUNTIME_WAVE_4_RELEASE, result }, result.valid === false ? 422 : 200, requestId);
}

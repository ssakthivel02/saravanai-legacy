export const MAX_BODY_BYTES = 131072;
export const clean = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export const array = (value, max = 100) => Array.isArray(value) ? value.slice(0, max) : [];
export const number = (value, min = 0, max = 100, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};
export const bool = (value) => value === true;

export function state(wave, sideEffects, env = {}) {
  const enabled = String(env[`RUNTIME_WAVE${wave}_ENABLED`] || '').toLowerCase() === 'true';
  const emergencyStopped = String(env[`RUNTIME_WAVE${wave}_EMERGENCY_STOP`] || 'true').toLowerCase() !== 'false';
  return { enabled, emergencyStopped, operational: enabled && !emergencyStopped, ...sideEffects };
}

export function ownerBoundary(request, env = {}) {
  const email = clean(request.headers.get('cf-access-authenticated-user-email'), 254).toLowerCase();
  const jwt = clean(request.headers.get('cf-access-jwt-assertion'), 4096);
  const owner = clean(env.OWNER_EMAIL, 254).toLowerCase();
  if (!email || !jwt) return { allowed: false, status: 401, code: 'ACCESS_AUTHENTICATION_REQUIRED' };
  if (!owner) return { allowed: false, status: 503, code: 'OWNER_EMAIL_NOT_CONFIGURED' };
  if (email !== owner) return { allowed: false, status: 403, code: 'OWNER_ACCESS_DENIED' };
  return { allowed: true };
}

export function response(payload, status = 200, requestId = crypto.randomUUID()) {
  return Response.json({ ...payload, requestId }, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Request-ID': requestId
    }
  });
}

export async function parseBody(request, requestId) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) return { error: response({ error: 'Request is too large.', code: 'PAYLOAD_TOO_LARGE' }, 413, requestId) };
  try { return { body: await request.json() }; }
  catch { return { error: response({ error: 'A valid JSON body is required.', code: 'INVALID_JSON' }, 400, requestId) }; }
}

export async function digest(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function createWaveHandler({ wave, release, mode, sideEffects, routes }) {
  return async function handleWave(request, env, url = new URL(request.url)) {
    const requestId = crypto.randomUUID();
    const current = state(wave, sideEffects, env);
    if (request.method === 'GET' && url.pathname === `/api/v1/runtime/v${wave}/status`) {
      return response({
        status: 'ok',
        release,
        enabled: current.enabled,
        emergencyStopped: current.emergencyStopped,
        operational: current.operational,
        ...sideEffects,
        mode,
        activation: current.operational ? 'owner-pilot' : 'disabled-or-emergency-stopped'
      }, 200, requestId);
    }

    const boundary = ownerBoundary(request, env);
    if (!boundary.allowed) return response({ error: boundary.code, code: boundary.code, publicRegistration: false }, boundary.status, requestId);
    if (!current.enabled) return response({ error: `Runtime Wave ${wave} is installed but disabled.`, code: `RUNTIME_WAVE_${wave}_DISABLED` }, 503, requestId);
    if (current.emergencyStopped) return response({ error: `Runtime Wave ${wave} is under emergency stop.`, code: `RUNTIME_WAVE_${wave}_EMERGENCY_STOPPED` }, 503, requestId);
    if (request.method !== 'POST') return response({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }, 405, requestId);

    const parsed = await parseBody(request, requestId);
    if (parsed.error) return parsed.error;
    const evaluator = routes[url.pathname];
    if (!evaluator) return response({ error: `Runtime Wave ${wave} API route not found.`, code: `RUNTIME_WAVE_${wave}_ROUTE_NOT_FOUND` }, 404, requestId);
    const result = await evaluator(parsed.body);
    return response({ release, result }, result.valid === false ? 422 : 200, requestId);
  };
}

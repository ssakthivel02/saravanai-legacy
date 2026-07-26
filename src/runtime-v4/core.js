export const MAX_BODY_BYTES = 65536;

export function clean(value, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function state(env = {}) {
  const enabled = String(env.RUNTIME_WAVE4_ENABLED || '').toLowerCase() === 'true';
  const emergencyStopped = String(env.RUNTIME_WAVE4_EMERGENCY_STOP || 'true').toLowerCase() !== 'false';
  return {
    enabled,
    emergencyStopped,
    operational: enabled && !emergencyStopped,
    workspaceWritesEnabled: false,
    invitationSendingEnabled: false,
    exportGenerationEnabled: false,
    paidFeaturesEnabled: false
  };
}

export function ownerBoundary(request, env = {}) {
  const email = clean(request.headers.get('cf-access-authenticated-user-email'), 254).toLowerCase();
  const jwt = Boolean(request.headers.get('cf-access-jwt-assertion'));
  const owner = clean(env.OWNER_EMAIL, 254).toLowerCase();
  if (!email || !jwt) return { allowed: false, status: 401, code: 'ACCESS_AUTHENTICATION_REQUIRED' };
  if (!owner) return { allowed: false, status: 503, code: 'OWNER_EMAIL_NOT_CONFIGURED' };
  if (email !== owner) return { allowed: false, status: 403, code: 'OWNER_ACCESS_DENIED' };
  return { allowed: true, status: 200, tenantId: 'owner' };
}

export function json(payload, statusCode = 200, requestId = crypto.randomUUID()) {
  return Response.json({ ...payload, requestId }, {
    status: statusCode,
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
  if (length > MAX_BODY_BYTES) return { error: json({ error: 'Request is too large.', code: 'PAYLOAD_TOO_LARGE' }, 413, requestId) };
  try { return { body: await request.json() }; }
  catch { return { error: json({ error: 'A valid JSON body is required.', code: 'INVALID_JSON' }, 400, requestId) }; }
}

export async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value)));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

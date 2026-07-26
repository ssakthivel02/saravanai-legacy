export const MAX_WAVE2_BODY_BYTES = 49152;

export function boolEnv(value) {
  return String(value || '').toLowerCase() === 'true';
}

export function wave2Json(payload, status = 200, requestId = crypto.randomUUID()) {
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

export function text(value, maximum = 200) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

export async function parseWave2Json(request, requestId) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_WAVE2_BODY_BYTES) {
    return { error: wave2Json({ error: 'Request is too large.', code: 'PAYLOAD_TOO_LARGE' }, 413, requestId) };
  }
  try {
    return { body: await request.json() };
  } catch {
    return { error: wave2Json({ error: 'A valid JSON body is required.', code: 'INVALID_JSON' }, 400, requestId) };
  }
}

export async function sha256(value) {
  const data = new TextEncoder().encode(String(value));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

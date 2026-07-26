export const MAX_WAVE3_BODY_BYTES = 65536;

export function boolEnv(value) {
  return String(value || '').toLowerCase() === 'true';
}

export function cleanText(value, maximum = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

export function wave3Json(payload, status = 200, requestId = crypto.randomUUID()) {
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

export async function parseWave3Json(request, requestId) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_WAVE3_BODY_BYTES) {
    return {
      error: wave3Json(
        { error: 'Request is too large.', code: 'PAYLOAD_TOO_LARGE' },
        413,
        requestId
      )
    };
  }

  try {
    return { body: await request.json() };
  } catch {
    return {
      error: wave3Json(
        { error: 'A valid JSON body is required.', code: 'INVALID_JSON' },
        400,
        requestId
      )
    };
  }
}

export async function sha256(value) {
  const bytes = new TextEncoder().encode(String(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function isoDate(value) {
  const raw = cleanText(value, 40);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return '';
  const parsed = new Date(`${raw}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? '' : raw;
}

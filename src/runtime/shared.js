export const MAX_RUNTIME_BODY_BYTES = 49152;

export function runtimeJson(payload, status = 200, requestId = crypto.randomUUID()) {
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

export async function parseRuntimeJson(request, requestId) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_RUNTIME_BODY_BYTES) {
    return {
      error: runtimeJson(
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
      error: runtimeJson(
        { error: 'A valid JSON body is required.', code: 'INVALID_JSON' },
        400,
        requestId
      )
    };
  }
}

export function normaliseText(value, maximum = 200) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

export function booleanEnv(value) {
  return String(value || '').toLowerCase() === 'true';
}

export async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

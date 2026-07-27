function clean(value, max = 128) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function requestId(request) {
  const existing = clean(request?.headers?.get?.('cf-ray') || request?.headers?.get?.('x-request-id'), 128);
  if (existing) return existing;
  return typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `request-${Date.now()}`;
}

export function createAccessDenialResponse(request, {
  status = 403,
  code = 'ACCESS_ROUTE_FORBIDDEN',
  routeId = 'unclassified-protected-route',
  reason = 'The verified profile is not authorised for this route.'
} = {}) {
  const id = requestId(request);
  const body = {
    error: 'SakthiAI access denied.',
    code: clean(code, 96) || 'ACCESS_ROUTE_FORBIDDEN',
    routeId: clean(routeId, 96) || 'unclassified-protected-route',
    reason: clean(reason, 240) || 'Access denied.',
    requestId: id,
    publicRegistration: false
  };
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json; charset=utf-8',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-SakthiAI-Request-ID': id
    }
  });
}

export const __test = { clean, requestId };

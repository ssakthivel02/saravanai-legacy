import { cleanText } from './shared.js';

export function ownerBoundary(request, env = {}) {
  const email = cleanText(
    request.headers.get('cf-access-authenticated-user-email'),
    254
  ).toLowerCase();
  const jwtPresent = Boolean(request.headers.get('cf-access-jwt-assertion'));
  const configuredOwner = cleanText(env.OWNER_EMAIL, 254).toLowerCase();

  if (!email || !jwtPresent) {
    return { allowed: false, status: 401, code: 'ACCESS_AUTHENTICATION_REQUIRED' };
  }
  if (!configuredOwner) {
    return { allowed: false, status: 503, code: 'OWNER_EMAIL_NOT_CONFIGURED' };
  }
  if (email !== configuredOwner) {
    return { allowed: false, status: 403, code: 'OWNER_ACCESS_DENIED' };
  }

  return {
    allowed: true,
    status: 200,
    tenantId: 'owner',
    actor: {
      type: 'private-owner',
      source: 'cloudflare-access',
      subject: `${email.slice(0, 2)}***@${email.split('@')[1]}`
    }
  };
}

export function wave3State(env = {}) {
  const enabled = String(env.RUNTIME_WAVE3_ENABLED || '').toLowerCase() === 'true';
  const emergencyStopped =
    String(env.RUNTIME_WAVE3_EMERGENCY_STOP || 'true').toLowerCase() !== 'false';

  return {
    enabled,
    emergencyStopped,
    operational: enabled && !emergencyStopped,
    externalFetchEnabled: false,
    databaseWritesEnabled: false,
    aiExecutionEnabled: false,
    paidProvidersEnabled: false
  };
}

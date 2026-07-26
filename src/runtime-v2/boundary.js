import { text } from './shared.js';

export function ownerBoundary(request, env = {}) {
  const email = text(request.headers.get('cf-access-authenticated-user-email'), 254).toLowerCase();
  const jwtPresent = Boolean(request.headers.get('cf-access-jwt-assertion'));
  const configuredOwner = text(env.OWNER_EMAIL, 254).toLowerCase();

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
    code: 'OWNER_AUTHORISED',
    actor: {
      type: 'private-owner',
      subject: `${email.slice(0, 2)}***@${email.split('@')[1]}`,
      source: 'cloudflare-access'
    },
    tenantId: 'owner'
  };
}

export function wave2State(env = {}) {
  const enabled = String(env.RUNTIME_WAVE2_ENABLED || '').toLowerCase() === 'true';
  const emergencyStopped = String(env.RUNTIME_WAVE2_EMERGENCY_STOP || 'true').toLowerCase() !== 'false';
  return {
    enabled,
    emergencyStopped,
    operational: enabled && !emergencyStopped,
    productionWritesEnabled: false,
    externalToolExecutionEnabled: false,
    paidProvidersEnabled: false
  };
}

import { normaliseText } from './shared.js';

export function accessIdentity(request, env = {}) {
  const email = normaliseText(
    request.headers.get('cf-access-authenticated-user-email'),
    254
  ).toLowerCase();
  const accessJwtPresent = Boolean(request.headers.get('cf-access-jwt-assertion'));
  const configuredOwner = normaliseText(env.OWNER_EMAIL, 254).toLowerCase();

  return {
    authenticated: Boolean(email && accessJwtPresent),
    ownerConfigured: Boolean(configuredOwner),
    ownerAuthorised: Boolean(
      email &&
      accessJwtPresent &&
      configuredOwner &&
      email === configuredOwner
    ),
    email,
    source: email && accessJwtPresent ? 'cloudflare-access' : 'none',
    assurance: email && accessJwtPresent
      ? 'cloudflare-access-policy-dependent'
      : 'unauthenticated'
  };
}

export function maskedEmail(email = '') {
  const [local, domain] = String(email).split('@');
  if (!local || !domain) return null;
  return `${local.slice(0, 2)}***@${domain}`;
}

export function requireOwner(identity) {
  if (!identity.authenticated) {
    return {
      allowed: false,
      status: 401,
      code: 'ACCESS_AUTHENTICATION_REQUIRED',
      reason: 'Cloudflare Access authentication is required.'
    };
  }

  if (!identity.ownerConfigured) {
    return {
      allowed: false,
      status: 503,
      code: 'OWNER_EMAIL_NOT_CONFIGURED',
      reason: 'The owner identity boundary is not configured.'
    };
  }

  if (!identity.ownerAuthorised) {
    return {
      allowed: false,
      status: 403,
      code: 'OWNER_ACCESS_DENIED',
      reason: 'The authenticated identity is not the configured owner.'
    };
  }

  return { allowed: true, status: 200, code: 'OWNER_AUTHORISED' };
}

const textEncoder = new TextEncoder();

export const TENANT_CONTEXT_RELEASE = 'verified-tenant-context-1.0.0';

const PROFILE_KEY_PATTERN = /^profile-[a-f0-9]{24}$/;
const ROLES = new Set(['owner', 'member', 'reader']);

function clean(value, max = 256) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function resolveTenantContext(request) {
  const verified = request?.headers?.get('x-sakthiai-access-verified') === 'true';
  const role = clean(request?.headers?.get('x-sakthiai-access-role'), 32);
  const profileKey = clean(request?.headers?.get('x-sakthiai-profile-key'), 64);

  if (!verified) return { valid: false, code: 'TENANT_VERIFIED_IDENTITY_REQUIRED', status: 401 };
  if (!ROLES.has(role)) return { valid: false, code: 'TENANT_ROLE_INVALID', status: 403 };
  if (!PROFILE_KEY_PATTERN.test(profileKey)) return { valid: false, code: 'TENANT_PROFILE_KEY_INVALID', status: 503 };

  const digest = await sha256Hex(`sakthiai:tenant:v1:${profileKey}`);
  return {
    valid: true,
    code: 'TENANT_CONTEXT_VERIFIED',
    status: 200,
    tenantId: `tenant-${digest.slice(0, 24)}`,
    actorId: `actor-${digest.slice(24, 48)}`,
    role,
    assurance: clean(request.headers.get('x-sakthiai-access-assurance'), 128) || 'verified-access-context',
    emailIncluded: false,
    profileKeyIncluded: false
  };
}

export function tenantContextSummary(context = {}) {
  return {
    release: TENANT_CONTEXT_RELEASE,
    valid: context.valid === true,
    role: context.valid ? context.role : null,
    tenantIdDerived: context.valid === true,
    tenantIdExposed: false,
    actorIdExposed: false,
    emailIncluded: false,
    profileKeyIncluded: false,
    code: context.code || 'TENANT_CONTEXT_UNAVAILABLE'
  };
}

export const __test = { clean, sha256Hex, PROFILE_KEY_PATTERN, ROLES };
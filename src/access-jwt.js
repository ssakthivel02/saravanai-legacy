import { compileAccessPolicy, normaliseEmail, resolveConfiguredRole } from './access-policy.js';

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);
const JWKS_CACHE_TTL_MS = 5 * 60 * 1000;
const jwksCache = new Map();

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function enabled(value) {
  return TRUE_VALUES.has(String(value ?? '').trim().toLowerCase());
}

function clean(value, max = 8192) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normaliseTeamDomain(value) {
  const raw = clean(value, 512);
  if (!raw) return '';
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol !== 'https:') return '';
    return url.origin;
  } catch {
    return '';
  }
}

function decodeBase64Url(value) {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function parseJsonSegment(value) {
  return JSON.parse(textDecoder.decode(decodeBase64Url(value)));
}

function parseJwt(token) {
  const parts = clean(token, 32768).split('.');
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error('ACCESS_JWT_MALFORMED');
  }
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = parseJsonSegment(encodedHeader);
  const payload = parseJsonSegment(encodedPayload);
  if (!header || typeof header !== 'object' || !payload || typeof payload !== 'object') {
    throw new Error('ACCESS_JWT_MALFORMED');
  }
  return {
    token,
    encodedHeader,
    encodedPayload,
    signingInput: `${encodedHeader}.${encodedPayload}`,
    signature: decodeBase64Url(encodedSignature),
    header,
    payload
  };
}

function audienceMatches(actual, expected) {
  if (Array.isArray(actual)) return actual.includes(expected);
  return actual === expected;
}

function allowedEmails(env = {}) {
  const policy = compileAccessPolicy(env);
  return {
    owner: policy.ownerEmail,
    values: new Set([policy.ownerEmail, ...policy.memberEmails, ...policy.readerEmails].filter(Boolean)),
    valid: policy.valid,
    teamProfilesEnabled: policy.teamProfilesEnabled,
    readerProfilesEnabled: policy.readerProfilesEnabled
  };
}

async function loadJwks(teamDomain, fetchImpl = fetch) {
  const cached = jwksCache.get(teamDomain);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const response = await fetchImpl(`${teamDomain}/cdn-cgi/access/certs`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('ACCESS_JWKS_FETCH_FAILED');
  const value = await response.json();
  if (!value || !Array.isArray(value.keys) || !value.keys.length) {
    throw new Error('ACCESS_JWKS_INVALID');
  }
  jwksCache.set(teamDomain, { value, expiresAt: Date.now() + JWKS_CACHE_TTL_MS });
  return value;
}

async function verifySignature(parsed, jwks) {
  if (parsed.header.alg !== 'RS256') throw new Error('ACCESS_JWT_ALGORITHM_REJECTED');
  const kid = clean(parsed.header.kid, 256);
  if (!kid) throw new Error('ACCESS_JWT_KID_MISSING');
  const jwk = jwks.keys.find((candidate) => candidate?.kid === kid && candidate?.kty === 'RSA');
  if (!jwk) throw new Error('ACCESS_JWT_SIGNING_KEY_NOT_FOUND');

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const verified = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    parsed.signature,
    textEncoder.encode(parsed.signingInput)
  );
  if (!verified) throw new Error('ACCESS_JWT_SIGNATURE_INVALID');
}

async function profileKey(email) {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(email));
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `profile-${hex.slice(0, 24)}`;
}

export function accessJwtEnforcementEnabled(env = {}) {
  return enabled(env.ACCESS_JWT_ENFORCEMENT_ENABLED);
}

export function isPublicAccessPath(pathname = '') {
  if (pathname === '/health' || pathname === '/api/v1/status') return true;
  if (pathname === '/api/v1/runtime/status') return true;
  if (pathname === '/api/v1/runtime/programme/status') return true;
  return /^\/api\/v1\/runtime\/v(?:[1-9]|[1-4][0-9]|50)\/status$/.test(pathname);
}

export async function verifyAccessJwt(token, request, env = {}, options = {}) {
  const teamDomain = normaliseTeamDomain(env.ACCESS_TEAM_DOMAIN);
  const audience = clean(env.ACCESS_AUD, 1024);
  if (!teamDomain || !audience) {
    return { valid: false, status: 503, code: 'ACCESS_JWT_CONFIGURATION_INCOMPLETE' };
  }

  const policy = compileAccessPolicy(env);
  if (!policy.valid) {
    return { valid: false, status: 503, code: 'ACCESS_ROLE_POLICY_INVALID' };
  }

  try {
    const parsed = parseJwt(token);
    const now = Number(options.nowSeconds ?? Math.floor(Date.now() / 1000));
    const issuer = normaliseTeamDomain(parsed.payload.iss);
    const email = normaliseEmail(parsed.payload.email);
    const headerEmail = normaliseEmail(request?.headers?.get('cf-access-authenticated-user-email'));

    if (issuer !== teamDomain) throw new Error('ACCESS_JWT_ISSUER_MISMATCH');
    if (!audienceMatches(parsed.payload.aud, audience)) throw new Error('ACCESS_JWT_AUDIENCE_MISMATCH');
    if (!Number.isFinite(parsed.payload.exp) || parsed.payload.exp <= now) throw new Error('ACCESS_JWT_EXPIRED');
    if (Number.isFinite(parsed.payload.nbf) && parsed.payload.nbf > now + 30) throw new Error('ACCESS_JWT_NOT_ACTIVE');
    if (!email) throw new Error('ACCESS_JWT_EMAIL_MISSING');
    if (headerEmail && headerEmail !== email) throw new Error('ACCESS_IDENTITY_HEADER_MISMATCH');

    const jwks = options.jwks ?? await loadJwks(teamDomain, options.fetchImpl);
    await verifySignature(parsed, jwks);

    const roleDecision = resolveConfiguredRole(email, env);
    if (!roleDecision.role) {
      return {
        valid: false,
        status: roleDecision.code === 'ACCESS_ROLE_POLICY_INVALID' ? 503 : 403,
        code: roleDecision.code
      };
    }

    return {
      valid: true,
      status: 200,
      code: 'ACCESS_AUTHORISED',
      identity: {
        email,
        role: roleDecision.role,
        profileKey: await profileKey(email),
        subject: clean(parsed.payload.sub, 512) || null,
        issuer: teamDomain,
        audience,
        expiresAt: new Date(parsed.payload.exp * 1000).toISOString(),
        assurance: 'cloudflare-access-jwt-rs256-verified',
        accessPolicyRelease: policy.release
      }
    };
  } catch (error) {
    return {
      valid: false,
      status: 401,
      code: error instanceof Error ? error.message : 'ACCESS_JWT_INVALID'
    };
  }
}

function errorResponse(url, result) {
  const body = {
    error: 'Cloudflare Access authentication is required.',
    code: result.code,
    publicRegistration: false
  };
  const headers = {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': 'application/json; charset=utf-8',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };
  if (url.pathname.startsWith('/api/') || url.pathname === '/health') {
    return Response.json(body, { status: result.status, headers });
  }
  return new Response('Cloudflare Access authentication is required.', {
    status: result.status,
    headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

export async function enforceAccessJwt(request, env = {}, url = new URL(request.url), options = {}) {
  if (!accessJwtEnforcementEnabled(env) || isPublicAccessPath(url.pathname)) {
    return { request, response: null, enforced: false, identity: null };
  }

  const token = request.headers.get('cf-access-jwt-assertion') || '';
  if (!token) {
    return {
      request,
      response: errorResponse(url, { status: 401, code: 'ACCESS_JWT_MISSING' }),
      enforced: true,
      identity: null
    };
  }

  const result = await verifyAccessJwt(token, request, env, options);
  if (!result.valid) {
    return { request, response: errorResponse(url, result), enforced: true, identity: null };
  }

  const headers = new Headers(request.headers);
  headers.set('x-sakthiai-access-verified', 'true');
  headers.set('x-sakthiai-access-email', result.identity.email);
  headers.set('x-sakthiai-access-role', result.identity.role);
  headers.set('x-sakthiai-profile-key', result.identity.profileKey);
  headers.set('x-sakthiai-access-assurance', result.identity.assurance);

  return {
    request: new Request(request, { headers }),
    response: null,
    enforced: true,
    identity: result.identity
  };
}

export const __test = {
  allowedEmails,
  audienceMatches,
  normaliseTeamDomain,
  parseJwt,
  profileKey
};

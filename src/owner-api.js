const RELEASE = '0.11.0-owner-security';
const AUTH_RELEASE = 'access-auth-profile-foundation-1.0.0';
const PROFILE_ISOLATION_RELEASE = 'authenticated-browser-profile-isolation-1.0.0';
const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

function enabled(value) {
  return TRUE_VALUES.has(String(value ?? '').trim().toLowerCase());
}

function maskedEmail(value = '') {
  const [local, domain] = String(value).split('@');
  if (!local || !domain) return null;
  return `${local.slice(0, 2)}***@${domain}`;
}

function accessIdentity(request, env = {}) {
  const enforcementEnabled = enabled(env.ACCESS_JWT_ENFORCEMENT_ENABLED);
  const cryptographicallyVerified = enforcementEnabled && request.headers.get('x-sakthiai-access-verified') === 'true';
  const verifiedEmail = cryptographicallyVerified ? request.headers.get('x-sakthiai-access-email') || '' : '';
  const legacyEmail = request.headers.get('cf-access-authenticated-user-email') || '';
  const legacyJwt = request.headers.get('cf-access-jwt-assertion') || '';
  const email = (verifiedEmail || (!enforcementEnabled && legacyEmail) || '').trim().toLowerCase();
  const authenticated = cryptographicallyVerified || (!enforcementEnabled && Boolean(legacyEmail && legacyJwt));
  const role = cryptographicallyVerified ? request.headers.get('x-sakthiai-access-role') || 'member' : authenticated ? 'owner-preview' : 'local-owner';
  const profileKey = cryptographicallyVerified ? request.headers.get('x-sakthiai-profile-key') || null : null;

  return {
    authenticated,
    cryptographicallyVerified,
    enforcementEnabled,
    email: email || null,
    maskedEmail: maskedEmail(email),
    role,
    profileKey,
    source: cryptographicallyVerified ? 'cloudflare-access-verified' : authenticated ? 'cloudflare-access-header-preview' : 'none',
    assurance: cryptographicallyVerified
      ? request.headers.get('x-sakthiai-access-assurance') || 'cloudflare-access-jwt-verified'
      : authenticated
        ? 'access-policy-dependent-not-cryptographically-verified-by-worker'
        : 'unauthenticated-local-preview'
  };
}

function bindings(env) {
  return {
    d1: Boolean(env.SAKTHI_DB && typeof env.SAKTHI_DB.prepare === 'function'),
    privateFiles: Boolean(env.EVIDENCE_BUCKET && typeof env.EVIDENCE_BUCKET.put === 'function'),
    aiSearch: Boolean(env.AI_SEARCH && typeof env.AI_SEARCH.get === 'function'),
    workersAi: Boolean(env.AI),
    ownerIngestionSecret: typeof env.SAKTHI_INGEST_TOKEN === 'string' && env.SAKTHI_INGEST_TOKEN.length >= 24,
    accessJwtEnforcement: enabled(env.ACCESS_JWT_ENFORCEMENT_ENABLED),
    premiumProvidersEnabled: false,
    kimiEnabled: false
  };
}

export async function handleOwnerApi(request, env, url) {
  if (request.method === 'GET' && url.pathname === '/api/v1/platform/capabilities') {
    const state = bindings(env);
    return json({
      status: 'ok',
      release: RELEASE,
      authRelease: AUTH_RELEASE,
      profileIsolationRelease: PROFILE_ISOLATION_RELEASE,
      deploymentMode: 'private-first-owner',
      persistenceMode: state.d1 ? 'server-d1' : 'browser-indexeddb',
      costPolicy: 'free-first',
      publicRegistration: false,
      features: {
        projects: { local: true, server: state.d1, privacyLock: true },
        conversations: { local: true, server: state.d1, encryptedExport: true },
        identity: {
          ownerLocal: true,
          cloudflareAccessReady: true,
          jwtVerificationReady: true,
          jwtEnforcementEnabled: state.accessJwtEnforcement,
          exactEmailAllowList: true,
          rolesPrepared: ['owner', 'member'],
          profileKeyPrepared: true,
          browserProfileIsolationImplemented: true,
          browserProfileIsolationReady: state.accessJwtEnforcement,
          crossDeviceProfileSync: false,
          publicAccounts: false
        },
        artifacts: { docx: true, xlsx: true, pptx: true, printPdf: true, codeZip: true, localGeneration: true },
        approvals: { dryRun: true, externalWrites: false },
        memory: { ownerApprovedOnly: true, local: true, server: state.d1 },
        knowledgeGraph: { local: true, server: state.d1 },
        usageLedger: { local: true, server: state.d1, paidCallsBlocked: true },
        backupSecurity: { aes256Gcm: true, pbkdf2Sha256: true, plaintextExport: false },
        mobile: { pwa: true, nativeClients: 'api-contract-prepared-not-released' }
      },
      bindings: state,
      requiredForPublicLaunch: [
        'Cloudflare Access or OIDC authentication',
        'cryptographic Access JWT validation',
        'D1 database and migrations',
        'tenant and role enforcement',
        'server-side quota enforcement',
        'abuse controls and legal documents',
        'export and deletion validation'
      ]
    });
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/platform/session') {
    const identity = accessIdentity(request, env);
    const verifiedProfile = Boolean(identity.cryptographicallyVerified && identity.profileKey);
    return json({
      status: 'ok',
      release: RELEASE,
      authRelease: AUTH_RELEASE,
      profileIsolationRelease: PROFILE_ISOLATION_RELEASE,
      mode: identity.cryptographicallyVerified
        ? `authenticated-${identity.role}`
        : identity.authenticated
          ? 'authenticated-header-preview'
          : 'local-owner-preview',
      identity,
      profileIsolationReady: verifiedProfile,
      browserProfilePartitioningEnabled: verifiedProfile,
      browserProfilePartitioningMode: verifiedProfile ? 'verified-pseudonymous-profile-key' : 'legacy-local-owner',
      crossDeviceProfileSyncEnabled: false,
      serverWritesAllowed: false,
      localPrivacyLock: true,
      encryptedBackups: true,
      publicRegistration: false,
      message: verifiedProfile
        ? 'Cloudflare Access JWT was cryptographically verified. Browser-local records and privacy-lock state are partitioned by the pseudonymous profile key on this device.'
        : identity.authenticated
          ? 'Cloudflare Access headers were detected, but Worker-side JWT enforcement remains disabled; the original local-owner database is preserved.'
          : 'No verified server identity detected. The original browser-local owner database and privacy lock remain active on this device.'
    });
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/mobile/config') {
    return json({
      status: 'ok',
      apiVersion: 'v1',
      release: RELEASE,
      authRelease: AUTH_RELEASE,
      profileIsolationRelease: PROFILE_ISOLATION_RELEASE,
      basePath: '/api/v1',
      authentication: 'Cloudflare Access JWT verification and browser profile isolation prepared; activation remains gated',
      currentClient: 'installable PWA',
      nativeClients: { android: 'not-released', ios: 'not-released' },
      endpoints: {
        health: '/health',
        status: '/api/v1/status',
        session: '/api/v1/platform/session',
        chat: '/api/v1/chat',
        stream: '/api/v1/chat/stream',
        research: '/api/v1/research',
        fileCapabilities: '/api/v1/files/capabilities',
        platformCapabilities: '/api/v1/platform/capabilities'
      }
    });
  }

  return json({ error: 'Owner platform API route not found.', code: 'OWNER_API_NOT_FOUND' }, 404);
}

const RELEASE = '0.11.0-owner-security';

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

function accessIdentity(request) {
  const email = request.headers.get('cf-access-authenticated-user-email') || '';
  const jwt = request.headers.get('cf-access-jwt-assertion') || '';
  return {
    authenticated: Boolean(email && jwt),
    email: email || null,
    source: email && jwt ? 'cloudflare-access' : 'none'
  };
}

function bindings(env) {
  return {
    d1: Boolean(env.SAKTHI_DB && typeof env.SAKTHI_DB.prepare === 'function'),
    privateFiles: Boolean(env.EVIDENCE_BUCKET && typeof env.EVIDENCE_BUCKET.put === 'function'),
    aiSearch: Boolean(env.AI_SEARCH && typeof env.AI_SEARCH.get === 'function'),
    workersAi: Boolean(env.AI),
    ownerIngestionSecret: typeof env.SAKTHI_INGEST_TOKEN === 'string' && env.SAKTHI_INGEST_TOKEN.length >= 24,
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
      deploymentMode: 'private-first-owner',
      persistenceMode: state.d1 ? 'server-d1' : 'browser-indexeddb',
      costPolicy: 'free-first',
      publicRegistration: false,
      features: {
        projects: { local: true, server: state.d1, privacyLock: true },
        conversations: { local: true, server: state.d1, encryptedExport: true },
        identity: { ownerLocal: true, cloudflareAccessReady: true, publicAccounts: false },
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
        'D1 database and migrations',
        'tenant and role enforcement',
        'server-side quota enforcement',
        'abuse controls and legal documents',
        'export and deletion validation'
      ]
    });
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/platform/session') {
    const identity = accessIdentity(request);
    return json({
      status: 'ok',
      release: RELEASE,
      mode: identity.authenticated ? 'authenticated-owner' : 'local-owner-preview',
      identity,
      serverWritesAllowed: false,
      localPrivacyLock: true,
      encryptedBackups: true,
      message: identity.authenticated
        ? 'Cloudflare Access identity detected. Server write APIs remain disabled until D1/RBAC activation.'
        : 'No server identity detected. Browser-local owner features require the local privacy lock on this device.'
    });
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/mobile/config') {
    return json({
      status: 'ok',
      apiVersion: 'v1',
      release: RELEASE,
      basePath: '/api/v1',
      authentication: 'Cloudflare Access/OIDC planned before native release',
      currentClient: 'installable PWA',
      nativeClients: { android: 'not-released', ios: 'not-released' },
      endpoints: {
        health: '/health',
        status: '/api/v1/status',
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

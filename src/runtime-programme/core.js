import {
  GROUPS,
  RUNTIME_PROGRAMME_RELEASE,
  RUNTIME_PROGRAMME_WAVE_COUNT,
  WAVE_CATALOG
} from './catalog.js';

const MAX_BODY_BYTES = 131072;
const TRUE = new Set(['true', '1', 'yes', 'on']);
const PASS = new Set(['success', 'pass', 'passed']);
const clean = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const bool = (value) => value === true;
const enabled = (env, name) => TRUE.has(String(env?.[name] ?? '').toLowerCase());
const stopped = (env, name) => !(['false', '0', 'no', 'off'].includes(String(env?.[name] ?? 'true').toLowerCase()));

export function secureHeaders(contentType = 'application/json; charset=utf-8') {
  return {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': contentType,
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };
}

export function json(payload, status = 200, requestId = crypto.randomUUID()) {
  return Response.json({ ...payload, requestId }, {
    status,
    headers: { ...secureHeaders(), 'X-Request-ID': requestId }
  });
}

export function html(payload, status = 200, requestId = crypto.randomUUID()) {
  return new Response(payload, {
    status,
    headers: { ...secureHeaders('text/html; charset=utf-8'), 'X-Request-ID': requestId }
  });
}

export function accessBoundary(request, env = {}) {
  const email = clean(request.headers.get('cf-access-authenticated-user-email'), 254).toLowerCase();
  const jwt = clean(request.headers.get('cf-access-jwt-assertion'), 8192);
  const owner = clean(env.OWNER_EMAIL, 254).toLowerCase();
  if (!email || !jwt) return { allowed: false, status: 401, code: 'ACCESS_AUTHENTICATION_REQUIRED' };
  if (!owner) return { allowed: false, status: 503, code: 'OWNER_EMAIL_NOT_CONFIGURED' };
  if (email !== owner) return { allowed: false, status: 403, code: 'OWNER_ACCESS_DENIED' };
  return { allowed: true };
}

export function waveState(number, env = {}) {
  const isEnabled = enabled(env, `RUNTIME_WAVE${number}_ENABLED`);
  const emergencyStopped = stopped(env, `RUNTIME_WAVE${number}_EMERGENCY_STOP`);
  return {
    enabled: isEnabled,
    emergencyStopped,
    operational: isEnabled && !emergencyStopped,
    enableVariablePresent: Object.prototype.hasOwnProperty.call(env, `RUNTIME_WAVE${number}_ENABLED`),
    emergencyStopVariablePresent: Object.prototype.hasOwnProperty.call(env, `RUNTIME_WAVE${number}_EMERGENCY_STOP`)
  };
}

export function unsafeConfigurationFindings(env = {}) {
  const findings = [];
  const directFlags = [
    'PUBLIC_TENANT_WRITES',
    'PUBLIC_REGISTRATION',
    'PUBLIC_REGISTRATION_ENABLED',
    'PREMIUM_PROVIDERS_ENABLED',
    'PAID_PROVIDERS_ENABLED',
    'UNIFIED_BILLING_ENABLED',
    'BILLING_ENABLED',
    'PAYMENTS_ENABLED',
    'AUTONOMOUS_PRODUCTION_WRITES_ENABLED',
    'EXTERNAL_TOOL_EXECUTION_ENABLED'
  ];
  for (const name of directFlags) if (enabled(env, name)) findings.push(`${name}_MUST_REMAIN_DISABLED`);
  for (let number = 1; number <= RUNTIME_PROGRAMME_WAVE_COUNT; number += 1) {
    for (const suffix of ['WRITES_ENABLED', 'PAID_PROVIDERS_ENABLED', 'PUBLIC_REGISTRATION_ENABLED']) {
      const name = `RUNTIME_WAVE${number}_${suffix}`;
      if (enabled(env, name)) findings.push(`${name}_MUST_REMAIN_DISABLED`);
    }
  }
  return findings;
}

export function programmeSummary(env = {}) {
  const waves = WAVE_CATALOG.map((wave) => ({ ...wave, ...waveState(wave.number, env) }));
  const enabledCount = waves.filter((wave) => wave.enabled).length;
  const emergencyStoppedCount = waves.filter((wave) => wave.emergencyStopped).length;
  const operationalCount = waves.filter((wave) => wave.operational).length;
  const unsafeFindings = unsafeConfigurationFindings(env);
  const groups = GROUPS.map((group) => {
    const members = waves.filter((wave) => wave.number >= group.firstWave && wave.number <= group.lastWave);
    return {
      ...group,
      waveCount: members.length,
      enabledCount: members.filter((wave) => wave.enabled).length,
      operationalCount: members.filter((wave) => wave.operational).length,
      emergencyStoppedCount: members.filter((wave) => wave.emergencyStopped).length
    };
  });
  return {
    release: RUNTIME_PROGRAMME_RELEASE,
    programme: 'SakthiAI Runtime Programme 1–50',
    totalWaves: RUNTIME_PROGRAMME_WAVE_COUNT,
    state: {
      enabledCount,
      disabledCount: RUNTIME_PROGRAMME_WAVE_COUNT - enabledCount,
      emergencyStoppedCount,
      operationalCount
    },
    safety: {
      status: unsafeFindings.length || operationalCount ? 'attention-required' : 'safe-by-default',
      ownerEmailConfigured: Boolean(clean(env.OWNER_EMAIL, 254)),
      publicRegistrationEnabled: false,
      paidProvidersEnabled: false,
      billingEnabled: false,
      productionWritesEnabled: false,
      autonomousActionsEnabled: false,
      externalExecutionEnabled: false,
      certificationClaimsEnabled: false,
      unsafeConfigurationFindings: unsafeFindings
    },
    bindings: {
      d1Present: Boolean(env.SAKTHI_DB && typeof env.SAKTHI_DB.prepare === 'function'),
      evidenceBucketPresent: Boolean(env.EVIDENCE_BUCKET),
      workersAiPresent: Boolean(env.AI),
      note: 'Binding presence is informational. This control centre does not read, write or invoke bindings.'
    },
    groups,
    waves
  };
}

export async function parseJson(request, requestId) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) {
    return { error: json({ error: 'Payload exceeds the bounded metadata limit.', code: 'PAYLOAD_TOO_LARGE' }, 413, requestId) };
  }
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return { error: json({ error: 'A JSON object is required.', code: 'INVALID_JSON_OBJECT' }, 400, requestId) };
    }
    return { body };
  } catch {
    return { error: json({ error: 'A valid JSON body is required.', code: 'INVALID_JSON' }, 400, requestId) };
  }
}

export function validateEvidence(input = {}) {
  const findings = [];
  const seen = new Set();
  const packets = Array.isArray(input.packets) ? input.packets.slice(0, 30).map((item, index) => {
    const id = clean(item?.id, 120);
    const scope = clean(item?.scope, 40).toLowerCase();
    const reference = clean(item?.reference, 200);
    const checkName = clean(item?.checkName, 160);
    const conclusion = clean(item?.conclusion, 30).toLowerCase();
    const observedAt = clean(item?.observedAt, 50);
    const reviewer = clean(item?.reviewer, 160);
    const artifactDigest = clean(item?.artifactDigest, 128).toLowerCase();
    if (!id) findings.push(`packet_${index}_id_required`);
    if (seen.has(id)) findings.push(`packet_${index}_duplicate_id`);
    if (id) seen.add(id);
    if (!['runtime-wave', 'runtime-range', 'programme'].includes(scope)) findings.push(`packet_${index}_scope_invalid`);
    if (!reference) findings.push(`packet_${index}_reference_required`);
    if (!checkName) findings.push(`packet_${index}_check_name_required`);
    if (!PASS.has(conclusion)) findings.push(`packet_${index}_conclusion_not_passed`);
    if (!observedAt || Number.isNaN(Date.parse(observedAt))) findings.push(`packet_${index}_observed_at_invalid`);
    if (!reviewer) findings.push(`packet_${index}_reviewer_required`);
    if (artifactDigest && !/^[a-f0-9]{64}$/.test(artifactDigest)) findings.push(`packet_${index}_digest_invalid`);
    return { id, scope, reference, checkName, conclusion, observedAt, reviewerPresent: Boolean(reviewer), artifactDigestPresent: Boolean(artifactDigest) };
  }) : [];
  if (!packets.length) findings.push('evidence_packet_required');
  return {
    valid: findings.length === 0,
    findings,
    evidence: {
      packets,
      sourcesFetched: false,
      artifactsDownloaded: false,
      signaturesCreated: false,
      persisted: false,
      published: false
    }
  };
}

export function smokeEndpoints(baseUrl = 'https://sakthiai.omsaravanabhava.org') {
  const origin = new URL(baseUrl);
  if (origin.protocol !== 'https:') throw new Error('HTTPS base URL required.');
  const endpoints = [
    { wave: 1, path: '/api/v1/runtime/status' },
    ...Array.from({ length: 49 }, (_, index) => ({ wave: index + 2, path: `/api/v1/runtime/v${index + 2}/status` }))
  ];
  return [
    { id: 'health', url: new URL('/health', origin).toString(), expected: { status: 'ok', publicRegistration: false } },
    ...endpoints.map((item) => ({
      id: `runtime-wave-${item.wave}`,
      wave: item.wave,
      url: new URL(item.path, origin).toString(),
      expected: { status: 'ok', enabled: false, productionWritesEnabled: false, paidProvidersEnabled: false }
    })),
    {
      id: 'runtime-programme',
      url: new URL('/api/v1/runtime/programme/status', origin).toString(),
      expected: { status: 'ok', totalWaves: 50, operationalCount: 0 }
    }
  ];
}

export function createSmokePlan(input = {}) {
  const baseUrl = clean(input.baseUrl, 500) || 'https://sakthiai.omsaravanabhava.org';
  try {
    const endpoints = smokeEndpoints(baseUrl);
    return {
      valid: true,
      findings: [],
      plan: {
        baseUrl: new URL(baseUrl).origin,
        endpointCount: endpoints.length,
        endpoints,
        method: 'GET',
        executionMode: 'manual-or-ci-only',
        executed: false,
        externalCallsEnabled: false,
        credentialsIncluded: false,
        persisted: false
      }
    };
  } catch {
    return { valid: false, findings: ['https_base_url_required'], plan: null };
  }
}

export function evaluateReleaseGate(input = {}, env = {}) {
  const summary = programmeSummary(env);
  const findings = [];
  const required = [
    ['exactHeadChecksPassed', input.exactHeadChecksPassed],
    ['smokeSuitePassed', input.smokeSuitePassed],
    ['rollbackReviewed', input.rollbackReviewed],
    ['ownerReviewed', input.ownerReviewed],
    ['evidenceIndexReviewed', input.evidenceIndexReviewed],
    ['cloudflareHealthy', input.cloudflareHealthy]
  ];
  for (const [name, value] of required) if (!bool(value)) findings.push(`${name}_required`);
  if (bool(input.migrationExecuted)) findings.push('migration_execution_not_permitted_for_this_tranche');
  if (bool(input.enableVariablesAdded)) findings.push('enable_variables_must_not_be_added');
  if (bool(input.emergencyStopVariablesAdded)) findings.push('emergency_stop_variables_must_not_be_added');
  if (summary.state.operationalCount) findings.push('operational_waves_require_separate_owner_pilot_review');
  findings.push(...summary.safety.unsafeConfigurationFindings);
  return {
    valid: findings.length === 0,
    findings,
    gate: {
      decision: findings.length ? 'block' : 'eligible-for-manual-owner-merge',
      ownerApprovalRequired: true,
      approved: false,
      merged: false,
      deployed: false,
      rollbackExecuted: false,
      productionWritesEnabled: false,
      billingEnabled: false,
      paidProvidersEnabled: false,
      autonomousActionsEnabled: false
    }
  };
}

export function rollbackPlan(input = {}) {
  const target = clean(input.targetCommit, 80) || 'previous-known-good-main';
  return {
    valid: true,
    findings: [],
    rollback: {
      target,
      executionMode: 'manual-owner-only',
      steps: [
        'Set or preserve every runtime emergency stop before any rollback action.',
        'Remove any runtime enable variable added during a separately approved owner pilot.',
        'Confirm public registration, billing, paid providers and production writes remain disabled.',
        'Use Cloudflare deployment history to select the previous known-good version.',
        'Shift traffic only after owner review of deployment identity and commit evidence.',
        'Run the read-only 52-endpoint smoke suite after rollback.',
        'Record the result in the release evidence index without storing secrets or request content.'
      ],
      executed: false,
      deploymentChanged: false,
      variablesChanged: false,
      messagesSent: false,
      persisted: false
    }
  };
}

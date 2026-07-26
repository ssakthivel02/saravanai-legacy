const MAX_BODY_BYTES = 196608;
const RESULT_VALUES = new Set(['pass', 'partial', 'fail', 'not-applicable', 'review']);
const IMPACT_VALUES = new Set(['low', 'medium', 'high', 'critical']);
const LIKELIHOOD_VALUES = new Set(['rare', 'unlikely', 'possible', 'likely', 'almost-certain']);
const REVERSIBILITY_VALUES = new Set(['easy', 'moderate', 'difficult', 'irreversible']);

export const clean = (value, max = 500) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export const list = (value, max = 200) =>
  Array.isArray(value) ? value.slice(0, max) : [];

export const numeric = (value, min = 0, max = 100, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

export const truthy = (value) => value === true;

export function runtimeState(waveNumber, env = {}) {
  const enabled = String(env[`RUNTIME_WAVE${waveNumber}_ENABLED`] || '').toLowerCase() === 'true';
  const emergencyStopped =
    String(env[`RUNTIME_WAVE${waveNumber}_EMERGENCY_STOP`] || 'true').toLowerCase() !== 'false';
  return {
    enabled,
    emergencyStopped,
    operational: enabled && !emergencyStopped
  };
}

export function ownerBoundary(request, env = {}) {
  const email = clean(request.headers.get('cf-access-authenticated-user-email'), 254).toLowerCase();
  const jwt = clean(request.headers.get('cf-access-jwt-assertion'), 8192);
  const owner = clean(env.OWNER_EMAIL, 254).toLowerCase();

  if (!email || !jwt) {
    return { allowed: false, status: 401, code: 'ACCESS_AUTHENTICATION_REQUIRED' };
  }
  if (!owner) {
    return { allowed: false, status: 503, code: 'OWNER_EMAIL_NOT_CONFIGURED' };
  }
  if (email !== owner) {
    return { allowed: false, status: 403, code: 'OWNER_ACCESS_DENIED' };
  }
  return { allowed: true };
}

export function jsonResponse(payload, status = 200, requestId = crypto.randomUUID()) {
  return Response.json({ ...payload, requestId }, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Request-ID': requestId
    }
  });
}

export async function parseJson(request, requestId) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) {
    return {
      error: jsonResponse(
        { error: 'Request payload exceeds the bounded metadata limit.', code: 'PAYLOAD_TOO_LARGE' },
        413,
        requestId
      )
    };
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return {
        error: jsonResponse(
          { error: 'A JSON object is required.', code: 'INVALID_JSON_OBJECT' },
          400,
          requestId
        )
      };
    }
    return { body };
  } catch {
    return {
      error: jsonResponse(
        { error: 'A valid JSON body is required.', code: 'INVALID_JSON' },
        400,
        requestId
      )
    };
  }
}

export function safeSideEffects() {
  return {
    externalCallsEnabled: false,
    aiExecutionEnabled: false,
    databaseWritesEnabled: false,
    productionWritesEnabled: false,
    repositoryWritesEnabled: false,
    infrastructureChangesEnabled: false,
    messagesSent: false,
    alertsSent: false,
    paymentsEnabled: false,
    paidProvidersEnabled: false,
    publicRegistrationEnabled: false,
    autonomousActionsEnabled: false,
    certificationClaimsEnabled: false
  };
}

export function assessDimensions(wave, input = {}) {
  const findings = [];
  const supplied = list(input.dimensions, 100);
  const configured = new Set(wave.dimensions);
  const seen = new Set();
  let weightedTotal = 0;
  let weightTotal = 0;

  const dimensions = supplied.map((item, index) => {
    const id = clean(item?.id, 100);
    const score = numeric(item?.score, 0, 100, 0);
    const weight = numeric(item?.weight, 0, 100, 0);
    const result = clean(item?.result, 30).toLowerCase();
    const evidence = clean(item?.evidence, 1000);

    if (!configured.has(id)) findings.push(`dimension_${index}_not_in_catalog`);
    if (seen.has(id)) findings.push(`dimension_${index}_duplicate`);
    if (id) seen.add(id);
    if (weight <= 0) findings.push(`dimension_${index}_weight_required`);
    if (!RESULT_VALUES.has(result)) findings.push(`dimension_${index}_result_invalid`);
    if (result === 'pass' && evidence.length < 8) findings.push(`dimension_${index}_evidence_required`);

    weightedTotal += score * weight;
    weightTotal += weight;

    return {
      id,
      score,
      weight,
      result,
      evidencePresent: evidence.length >= 8
    };
  });

  for (const id of wave.dimensions) {
    if (!seen.has(id)) findings.push(`dimension_missing:${id}`);
  }

  const score = weightTotal ? Math.round((weightedTotal / weightTotal) * 100) / 100 : 0;
  const blocking = dimensions.some((item) => item.result === 'fail') ||
    findings.some((item) => item.startsWith('dimension_missing'));

  return {
    valid: findings.length === 0,
    findings,
    assessment: {
      wave: wave.title,
      score,
      rating: blocking ? 'blocked' : score >= 90 ? 'strong' : score >= 75 ? 'conditional' : 'insufficient',
      dimensions,
      humanReviewRequired: true,
      evaluatedFromCallerSuppliedMetadata: true,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

export function validateEvidence(wave, input = {}) {
  const findings = [];
  const items = list(input.items, 300).map((item, index) => {
    const id = clean(item?.id, 160);
    const type = clean(item?.type, 80);
    const source = clean(item?.source, 500);
    const digest = clean(item?.digest, 128).toLowerCase();
    const result = clean(item?.result, 30).toLowerCase();
    const observedAt = clean(item?.observedAt, 50);

    if (!id) findings.push(`evidence_${index}_id_required`);
    if (!type) findings.push(`evidence_${index}_type_required`);
    if (source && !source.startsWith('https://')) findings.push(`evidence_${index}_source_https_required`);
    if (digest && !/^[a-f0-9]{64}$/.test(digest)) findings.push(`evidence_${index}_sha256_invalid`);
    if (!RESULT_VALUES.has(result)) findings.push(`evidence_${index}_result_invalid`);
    if (observedAt && Number.isNaN(Date.parse(observedAt))) findings.push(`evidence_${index}_observed_at_invalid`);

    return {
      id,
      type,
      sourcePresent: Boolean(source),
      digestPresent: Boolean(digest),
      result,
      observedAt
    };
  });

  if (!items.length) findings.push('evidence_item_required');

  return {
    valid: findings.length === 0,
    findings,
    evidence: {
      wave: wave.title,
      items,
      sourcesFetched: false,
      signaturesCreated: false,
      evidencePublished: false,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

export function classifyRisk(wave, input = {}) {
  const findings = [];
  const impact = clean(input.impact, 30).toLowerCase();
  const likelihood = clean(input.likelihood, 30).toLowerCase();
  const reversibility = clean(input.reversibility, 30).toLowerCase();
  const regulated = truthy(input.regulated);
  const humanImpact = truthy(input.humanImpact);

  if (!IMPACT_VALUES.has(impact)) findings.push('impact_invalid');
  if (!LIKELIHOOD_VALUES.has(likelihood)) findings.push('likelihood_invalid');
  if (!REVERSIBILITY_VALUES.has(reversibility)) findings.push('reversibility_invalid');

  const impactScore = { low: 1, medium: 2, high: 3, critical: 4 }[impact] || 0;
  const likelihoodScore = { rare: 1, unlikely: 2, possible: 3, likely: 4, 'almost-certain': 5 }[likelihood] || 0;
  const reversibilityScore = { easy: 1, moderate: 2, difficult: 3, irreversible: 4 }[reversibility] || 0;
  const raw = impactScore * likelihoodScore + reversibilityScore + (regulated ? 4 : 0) + (humanImpact ? 4 : 0);
  const tier = raw >= 22 ? 4 : raw >= 14 ? 3 : raw >= 8 ? 2 : 1;

  return {
    valid: findings.length === 0,
    findings,
    classification: {
      wave: wave.title,
      tier,
      score: raw,
      ownerApprovalRequired: tier >= 2,
      independentReviewRequired: tier >= 3,
      executionAllowed: false,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

export function validatePlan(wave, input = {}) {
  const findings = [];
  const steps = list(input.steps, 50).map((value) => clean(value, 500)).filter(Boolean);
  const owners = list(input.owners, 30).map((value) => clean(value, 254)).filter(Boolean);
  const dependencies = list(input.dependencies, 100).map((value) => clean(value, 160)).filter(Boolean);
  const verification = list(input.verification, 50).map((value) => clean(value, 500)).filter(Boolean);
  const rollback = list(input.rollback, 50).map((value) => clean(value, 500)).filter(Boolean);

  if (steps.length < 3) findings.push('minimum_three_steps_required');
  if (!owners.length) findings.push('owner_required');
  if (!verification.length) findings.push('verification_required');
  if (!rollback.length) findings.push('rollback_required');
  if (steps.length > 25) findings.push('plan_exceeds_bounded_step_limit');

  return {
    valid: findings.length === 0,
    findings,
    plan: {
      wave: wave.title,
      steps,
      owners,
      dependencies,
      verification,
      rollback,
      approved: false,
      executed: false,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

export function evaluateGate(wave, input = {}) {
  const findings = [];
  const evidence = input.evidence && typeof input.evidence === 'object' && !Array.isArray(input.evidence)
    ? input.evidence
    : {};

  for (const key of wave.gateEvidence) {
    if (evidence[key] !== 'pass') findings.push(`${key}_evidence_not_passed`);
  }

  const prohibitedRequests = {
    autoExecuteRequested: truthy(input.autoExecuteRequested),
    autoWriteRequested: truthy(input.autoWriteRequested),
    autoPublishRequested: truthy(input.autoPublishRequested),
    autoNotifyRequested: truthy(input.autoNotifyRequested),
    paymentRequested: truthy(input.paymentRequested),
    paidProviderRequested: truthy(input.paidProviderRequested),
    publicRegistrationRequested: truthy(input.publicRegistrationRequested),
    certificationClaimRequested: truthy(input.certificationClaimRequested)
  };

  for (const [key, requested] of Object.entries(prohibitedRequests)) {
    if (requested) findings.push(`${key.replace('Requested', '')}_denied`);
  }

  return {
    valid: findings.length === 0,
    findings,
    gate: {
      wave: wave.title,
      decision: findings.length ? 'block' : 'eligible-for-owner-approval',
      ownerApprovalRequired: true,
      independentReviewRecommended: true,
      approved: false,
      executed: false,
      published: false,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

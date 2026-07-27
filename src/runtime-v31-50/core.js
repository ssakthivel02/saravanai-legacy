const MAX_BODY_BYTES = 196608;
const CONTROL_STATUS = new Set(['implemented', 'partial', 'planned', 'not-applicable', 'failed', 'review']);
const EVIDENCE_STATUS = new Set(['pass', 'partial', 'fail', 'not-applicable', 'review']);
const IMPACT_VALUES = new Set(['low', 'medium', 'high', 'critical']);
const LIKELIHOOD_VALUES = new Set(['rare', 'unlikely', 'possible', 'likely', 'almost-certain']);
const CONFIDENCE_VALUES = new Set(['low', 'medium', 'high']);
const MAX_EXCEPTION_DAYS = 180;

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

export function safeSideEffects() {
  return {
    externalCallsEnabled: false,
    sourceRetrievalEnabled: false,
    aiExecutionEnabled: false,
    toolExecutionEnabled: false,
    codeExecutionEnabled: false,
    databaseWritesEnabled: false,
    repositoryWritesEnabled: false,
    productionWritesEnabled: false,
    infrastructureChangesEnabled: false,
    identityChangesEnabled: false,
    policyEnforcementEnabled: false,
    notificationsEnabled: false,
    messagesSent: false,
    alertsSent: false,
    paymentsEnabled: false,
    billingEnabled: false,
    paidProvidersEnabled: false,
    publicRegistrationEnabled: false,
    autonomousDecisionsEnabled: false,
    legalDeterminationsEnabled: false,
    medicalDeterminationsEnabled: false,
    financialDeterminationsEnabled: false,
    certificationClaimsEnabled: false,
    personalDataPersisted: false,
    biometricProcessingEnabled: false,
    childProfilingEnabled: false
  };
}

export function jsonResponse(payload, status = 200, requestId = crypto.randomUUID()) {
  return Response.json({ ...payload, requestId }, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
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

function riskScore(impact, likelihood) {
  const impactScore = { low: 1, medium: 2, high: 3, critical: 4 }[impact] || 0;
  const likelihoodScore = { rare: 1, unlikely: 2, possible: 3, likely: 4, 'almost-certain': 5 }[likelihood] || 0;
  return impactScore * likelihoodScore;
}

export function assessControls(wave, input = {}) {
  const findings = [];
  const configured = new Set(wave.controls);
  const seen = new Set();
  let weightedTotal = 0;
  let totalWeight = 0;

  const controls = list(input.controls, 160).map((item, index) => {
    const id = clean(item?.id, 100);
    const status = clean(item?.status, 40).toLowerCase();
    const score = numeric(item?.score, 0, 100, 0);
    const weight = numeric(item?.weight, 0, 100, 0);
    const owner = clean(item?.owner, 254);
    const evidenceRefs = list(item?.evidenceRefs, 30).map((value) => clean(value, 160)).filter(Boolean);

    if (!configured.has(id)) findings.push(`control_${index}_not_in_catalog`);
    if (seen.has(id)) findings.push(`control_${index}_duplicate`);
    if (id) seen.add(id);
    if (!CONTROL_STATUS.has(status)) findings.push(`control_${index}_status_invalid`);
    if (weight <= 0) findings.push(`control_${index}_weight_required`);
    if (!owner) findings.push(`control_${index}_owner_required`);
    if (status === 'implemented' && evidenceRefs.length === 0) {
      findings.push(`control_${index}_evidence_reference_required`);
    }

    weightedTotal += score * weight;
    totalWeight += weight;

    return {
      id,
      status,
      score,
      weight,
      ownerPresent: Boolean(owner),
      evidenceReferenceCount: evidenceRefs.length
    };
  });

  for (const id of wave.controls) {
    if (!seen.has(id)) findings.push(`control_missing:${id}`);
  }

  const maturityScore = totalWeight ? Math.round((weightedTotal / totalWeight) * 100) / 100 : 0;
  const blocking = controls.some((item) => item.status === 'failed') ||
    findings.some((item) => item.startsWith('control_missing:'));

  return {
    valid: findings.length === 0,
    findings,
    assessment: {
      wave: wave.title,
      maturityScore,
      posture: blocking ? 'blocked' : maturityScore >= 90 ? 'strong' : maturityScore >= 75 ? 'conditional' : 'insufficient',
      controls,
      evaluatedFromCallerSuppliedMetadata: true,
      humanReviewRequired: true,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

export function validateEvidence(wave, input = {}) {
  const findings = [];
  const seen = new Set();

  const items = list(input.items, 300).map((item, index) => {
    const id = clean(item?.id, 160);
    const controlId = clean(item?.controlId, 100);
    const type = clean(item?.type, 80);
    const source = clean(item?.source, 500);
    const digest = clean(item?.digest, 128).toLowerCase();
    const status = clean(item?.status, 30).toLowerCase();
    const classification = clean(item?.classification, 40).toLowerCase();
    const observedAt = clean(item?.observedAt, 50);
    const expiresAt = clean(item?.expiresAt, 50);

    if (!id) findings.push(`evidence_${index}_id_required`);
    if (seen.has(id)) findings.push(`evidence_${index}_duplicate`);
    if (id) seen.add(id);
    if (!wave.controls.includes(controlId)) findings.push(`evidence_${index}_control_invalid`);
    if (!type) findings.push(`evidence_${index}_type_required`);
    if (source && !source.startsWith('https://')) findings.push(`evidence_${index}_source_https_required`);
    if (digest && !/^[a-f0-9]{64}$/.test(digest)) findings.push(`evidence_${index}_sha256_invalid`);
    if (!EVIDENCE_STATUS.has(status)) findings.push(`evidence_${index}_status_invalid`);
    if (!['public', 'internal', 'confidential', 'restricted'].includes(classification)) {
      findings.push(`evidence_${index}_classification_invalid`);
    }
    if (observedAt && Number.isNaN(Date.parse(observedAt))) findings.push(`evidence_${index}_observed_at_invalid`);
    if (expiresAt && Number.isNaN(Date.parse(expiresAt))) findings.push(`evidence_${index}_expires_at_invalid`);

    return {
      id,
      controlId,
      type,
      sourcePresent: Boolean(source),
      digestPresent: Boolean(digest),
      status,
      classification,
      observedAt,
      expiresAt
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

export function evaluateScenario(wave, input = {}) {
  const findings = [];
  const assumptions = list(input.assumptions, 50).map((value) => clean(value, 500)).filter(Boolean);
  const threats = list(input.threats, 100).map((item, index) => {
    const id = clean(item?.id, 120);
    const impact = clean(item?.impact, 30).toLowerCase();
    const likelihood = clean(item?.likelihood, 30).toLowerCase();
    const mitigation = clean(item?.mitigation, 1000);
    const confidence = clean(item?.confidence, 30).toLowerCase();
    const residualImpact = clean(item?.residualImpact, 30).toLowerCase();
    const residualLikelihood = clean(item?.residualLikelihood, 30).toLowerCase();

    if (!id) findings.push(`threat_${index}_id_required`);
    if (!IMPACT_VALUES.has(impact)) findings.push(`threat_${index}_impact_invalid`);
    if (!LIKELIHOOD_VALUES.has(likelihood)) findings.push(`threat_${index}_likelihood_invalid`);
    if (!mitigation) findings.push(`threat_${index}_mitigation_required`);
    if (!CONFIDENCE_VALUES.has(confidence)) findings.push(`threat_${index}_confidence_invalid`);
    if (!IMPACT_VALUES.has(residualImpact)) findings.push(`threat_${index}_residual_impact_invalid`);
    if (!LIKELIHOOD_VALUES.has(residualLikelihood)) findings.push(`threat_${index}_residual_likelihood_invalid`);

    return {
      id,
      inherentScore: riskScore(impact, likelihood),
      residualScore: riskScore(residualImpact, residualLikelihood),
      confidence,
      mitigationPresent: Boolean(mitigation)
    };
  });

  if (!assumptions.length) findings.push('assumption_required');
  if (!threats.length) findings.push('threat_required');

  const maximumResidualScore = threats.reduce((max, item) => Math.max(max, item.residualScore), 0);
  const decision = maximumResidualScore >= 12 ? 'block' : maximumResidualScore >= 6 ? 'conditional' : 'review-ready';

  return {
    valid: findings.length === 0,
    findings,
    scenario: {
      wave: wave.title,
      assumptions,
      threats,
      maximumResidualScore,
      decision,
      humanReviewRequired: true,
      simulatedActionsExecuted: false,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

export function validateException(wave, input = {}) {
  const findings = [];
  const owner = clean(input.owner, 254);
  const reason = clean(input.reason, 2000);
  const createdAt = clean(input.createdAt, 50);
  const expiresAt = clean(input.expiresAt, 50);
  const controls = list(input.compensatingControls, 30).map((value) => clean(value, 500)).filter(Boolean);
  const verification = list(input.verification, 30).map((value) => clean(value, 500)).filter(Boolean);
  const rollback = list(input.rollback, 30).map((value) => clean(value, 500)).filter(Boolean);

  if (!owner) findings.push('exception_owner_required');
  if (reason.length < 20) findings.push('exception_reason_too_short');
  if (!createdAt || Number.isNaN(Date.parse(createdAt))) findings.push('exception_created_at_invalid');
  if (!expiresAt || Number.isNaN(Date.parse(expiresAt))) findings.push('exception_expires_at_invalid');
  if (!controls.length) findings.push('compensating_control_required');
  if (!verification.length) findings.push('verification_required');
  if (!rollback.length) findings.push('rollback_required');

  let durationDays = null;
  if (!Number.isNaN(Date.parse(createdAt)) && !Number.isNaN(Date.parse(expiresAt))) {
    durationDays = Math.ceil((Date.parse(expiresAt) - Date.parse(createdAt)) / 86400000);
    if (durationDays <= 0) findings.push('exception_expiry_must_be_future');
    if (durationDays > MAX_EXCEPTION_DAYS) findings.push('exception_exceeds_180_day_limit');
  }

  return {
    valid: findings.length === 0,
    findings,
    exception: {
      wave: wave.title,
      ownerPresent: Boolean(owner),
      durationDays,
      compensatingControls: controls,
      verification,
      rollback,
      approved: false,
      applied: false,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

export function evaluateDecisionGate(wave, input = {}) {
  const findings = [];
  const evidence = input.evidence && typeof input.evidence === 'object' && !Array.isArray(input.evidence)
    ? input.evidence
    : {};
  const residualRisk = clean(input.residualRisk, 30).toLowerCase();
  const independentReview = truthy(input.independentReview);
  const ownerReview = truthy(input.ownerReview);
  const rollbackVerified = truthy(input.rollbackVerified);

  for (const key of wave.gate) {
    if (evidence[key] !== 'pass') findings.push(`${key}_evidence_not_passed`);
  }

  if (!['low', 'medium', 'high', 'critical'].includes(residualRisk)) {
    findings.push('residual_risk_invalid');
  } else if (['high', 'critical'].includes(residualRisk)) {
    findings.push('residual_risk_above_gate');
  }

  if (!independentReview) findings.push('independent_review_required');
  if (!ownerReview) findings.push('owner_review_required');
  if (!rollbackVerified) findings.push('rollback_verification_required');

  const prohibitedRequests = {
    autoExecuteRequested: truthy(input.autoExecuteRequested),
    autoApproveRequested: truthy(input.autoApproveRequested),
    autoWriteRequested: truthy(input.autoWriteRequested),
    autoPublishRequested: truthy(input.autoPublishRequested),
    autoNotifyRequested: truthy(input.autoNotifyRequested),
    enforcementRequested: truthy(input.enforcementRequested),
    paymentRequested: truthy(input.paymentRequested),
    billingRequested: truthy(input.billingRequested),
    paidProviderRequested: truthy(input.paidProviderRequested),
    publicRegistrationRequested: truthy(input.publicRegistrationRequested),
    certificationClaimRequested: truthy(input.certificationClaimRequested),
    legalDeterminationRequested: truthy(input.legalDeterminationRequested),
    medicalDeterminationRequested: truthy(input.medicalDeterminationRequested),
    financialDeterminationRequested: truthy(input.financialDeterminationRequested)
  };

  for (const [key, requested] of Object.entries(prohibitedRequests)) {
    if (requested) findings.push(`${key.replace('Requested', '')}_denied`);
  }

  return {
    valid: findings.length === 0,
    findings,
    gate: {
      wave: wave.title,
      decision: findings.length ? 'block' : 'eligible-for-manual-owner-decision',
      ownerDecisionRequired: true,
      independentReviewRequired: true,
      approved: false,
      executed: false,
      published: false,
      persisted: false,
      ...safeSideEffects()
    }
  };
}

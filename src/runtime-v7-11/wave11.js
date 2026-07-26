import { array, bool, clean, createWaveHandler, digest, number } from './core.js';

function controlsAssess(input = {}) {
  const controls = array(input.controls, 500);
  const findings = [];
  const results = controls.map((control, index) => {
    const id = clean(control?.id, 120);
    const status = clean(control?.status, 30).toLowerCase();
    const evidence = clean(control?.evidence, 500);
    if (!id) findings.push(`control_${index}_id_required`);
    if (!['pass', 'fail', 'partial', 'not-applicable'].includes(status)) findings.push(`control_${index}_status_invalid`);
    if (status === 'pass' && !evidence) findings.push(`control_${index}_evidence_required`);
    return { id, status, evidencePresent: Boolean(evidence) };
  });
  if (!results.length) findings.push('control_required');
  return { valid: findings.length === 0, findings, assessment: { controls: results, certificationClaimed: false, evidencePublished: false } };
}

async function trustPacket(input = {}) {
  const organisation = clean(input.organisation, 160);
  const scope = array(input.scope, 100).map((v) => clean(v, 160)).filter(Boolean);
  const evidence = array(input.evidence, 300).map((v) => ({ id: clean(v?.id, 120), result: clean(v?.result, 30).toLowerCase() }));
  const findings = [];
  if (!organisation) findings.push('organisation_required');
  if (!scope.length) findings.push('scope_required');
  if (!evidence.length) findings.push('evidence_required');
  for (const [index, item] of evidence.entries()) {
    if (!item.id) findings.push(`evidence_${index}_id_required`);
    if (!['pass', 'fail', 'review'].includes(item.result)) findings.push(`evidence_${index}_result_invalid`);
  }
  const payload = { organisation, scope, evidence };
  return {
    valid: findings.length === 0,
    findings,
    packet: { payload, sha256: await digest(payload), signed: false, published: false, customerDataPublished: false, certificationClaimed: false }
  };
}

function readinessScore(input = {}) {
  const dimensions = array(input.dimensions, 100);
  const findings = [];
  let weighted = 0;
  let totalWeight = 0;
  const results = dimensions.map((dimension, index) => {
    const name = clean(dimension?.name, 120);
    const score = number(dimension?.score, 0, 100, 0);
    const weight = number(dimension?.weight, 0, 100, 0);
    if (!name) findings.push(`dimension_${index}_name_required`);
    if (weight <= 0) findings.push(`dimension_${index}_weight_required`);
    weighted += score * weight;
    totalWeight += weight;
    return { name, score, weight };
  });
  if (!results.length) findings.push('dimension_required');
  const score = totalWeight ? Math.round((weighted / totalWeight) * 100) / 100 : 0;
  return {
    valid: findings.length === 0,
    findings,
    readiness: { score, rating: score >= 90 ? 'ready-for-human-review' : score >= 75 ? 'conditional' : 'not-ready', launchExecuted: false, certificationClaimed: false }
  };
}

function closeException(input = {}) {
  const exceptionId = clean(input.exceptionId, 120);
  const evidence = array(input.evidence, 100).map((v) => clean(v, 300)).filter(Boolean);
  const verifiedBy = clean(input.verifiedBy, 254);
  const findings = [];
  if (!exceptionId) findings.push('exception_id_required');
  if (!evidence.length) findings.push('closure_evidence_required');
  if (!verifiedBy.includes('@')) findings.push('verifier_required');
  return { valid: findings.length === 0, findings, closure: { exceptionId, verifiedBy, decision: findings.length ? 'remain-open' : 'eligible-for-human-closure', closed: false, registryWritten: false } };
}

function launchGate(input = {}) {
  const evidence = input.evidence && typeof input.evidence === 'object' ? input.evidence : {};
  const required = ['security', 'privacy', 'resilience', 'operations', 'support', 'accessibility', 'legalReview', 'rollback'];
  const findings = [];
  for (const key of required) if (evidence[key] !== 'pass') findings.push(`${key}_evidence_not_passed`);
  if (bool(input.autoLaunchRequested)) findings.push('automatic_launch_denied');
  if (bool(input.certificationClaimRequested)) findings.push('unsupported_certification_claim_denied');
  return {
    valid: findings.length === 0,
    findings,
    gate: {
      decision: findings.length ? 'block' : 'eligible-for-owner-approval',
      humanApprovalRequired: true,
      launchExecuted: false,
      contractExecuted: false,
      customerDataPublished: false,
      certificationClaimed: false
    }
  };
}

export const RUNTIME_WAVE_11_RELEASE = 'runtime-wave-11.0.0';
export const RUNTIME_WAVE_11_SIDE_EFFECTS = Object.freeze({
  customerDataPublished: false,
  certificationClaimed: false,
  contractsExecuted: false,
  launchExecuted: false,
  productionWritesEnabled: false,
  paidAssuranceServicesEnabled: false
});
const routes = {
  '/api/v1/runtime/v11/controls/assess': controlsAssess,
  '/api/v1/runtime/v11/trust-packet/build': trustPacket,
  '/api/v1/runtime/v11/readiness/score': readinessScore,
  '/api/v1/runtime/v11/exceptions/close': closeException,
  '/api/v1/runtime/v11/launch/gate': launchGate
};
export const handleRuntimeWave11 = createWaveHandler({
  wave: 11,
  release: RUNTIME_WAVE_11_RELEASE,
  mode: 'private-owner-enterprise-readiness-assurance-only',
  sideEffects: RUNTIME_WAVE_11_SIDE_EFFECTS,
  routes
});
export const __testWave11 = { controlsAssess, trustPacket, readinessScore, closeException, launchGate };

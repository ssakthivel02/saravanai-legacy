import { array, bool, clean, createWaveHandler, number } from './core.js';

function dataClassify(input = {}) {
  const fields = array(input.fields, 300);
  const findings = [];
  const allowed = new Set(['public', 'internal', 'confidential', 'restricted', 'personal', 'special-category']);
  const classified = fields.map((field, index) => {
    const name = clean(field?.name, 160);
    const classification = clean(field?.classification, 50).toLowerCase();
    if (!name) findings.push(`field_${index}_name_required`);
    if (!allowed.has(classification)) findings.push(`field_${index}_classification_invalid`);
    return { name, classification };
  });
  if (!classified.length) findings.push('field_required');
  return { valid: findings.length === 0, findings, result: { fields: classified, stored: false, personalDataCopied: false } };
}

function retentionEvaluate(input = {}) {
  const classification = clean(input.classification, 50).toLowerCase();
  const days = Math.floor(number(input.retentionDays, 0, 3650, 0));
  const legalBasis = clean(input.legalBasis, 100);
  const findings = [];
  if (!classification) findings.push('classification_required');
  if (!legalBasis) findings.push('legal_basis_required');
  if (days < 1) findings.push('retention_period_required');
  if (['personal', 'special-category'].includes(classification) && days > 730) findings.push('extended_personal_data_retention_review_required');
  return {
    valid: findings.length === 0,
    findings,
    retention: { classification, days, legalBasis, decision: findings.length ? 'review' : 'eligible-for-human-approval', policyApplied: false, recordsDeleted: false }
  };
}

function deletionPlan(input = {}) {
  const systems = array(input.systems, 100).map((v) => clean(v, 160)).filter(Boolean);
  const subjectReference = clean(input.subjectReference, 160);
  const approvals = array(input.approvals, 20).map((v) => clean(v, 160)).filter(Boolean);
  const findings = [];
  if (!systems.length) findings.push('system_required');
  if (!subjectReference) findings.push('subject_reference_required');
  if (!approvals.length) findings.push('approval_required');
  return {
    valid: findings.length === 0,
    findings,
    plan: { systems, subjectReferenceHashOnly: true, decision: findings.length ? 'incomplete' : 'ready-for-human-execution', deletionExecuted: false, exportGenerated: false }
  };
}

function residencyAssess(input = {}) {
  const source = clean(input.sourceRegion, 80).toUpperCase();
  const target = clean(input.targetRegion, 80).toUpperCase();
  const allowed = array(input.allowedRegions, 50).map((v) => clean(v, 80).toUpperCase()).filter(Boolean);
  const findings = [];
  if (!source) findings.push('source_region_required');
  if (!target) findings.push('target_region_required');
  if (!allowed.length) findings.push('allowed_region_required');
  if (target && !allowed.includes(target)) findings.push('target_region_not_allowlisted');
  return { valid: findings.length === 0, findings, assessment: { source, target, allowed, transferExecuted: false, residencyChanged: false } };
}

function dsarValidate(input = {}) {
  const requestType = clean(input.requestType, 50).toLowerCase();
  const identityVerified = bool(input.identityVerified);
  const scope = array(input.scope, 100).map((v) => clean(v, 160)).filter(Boolean);
  const findings = [];
  if (!['access', 'rectification', 'erasure', 'restriction', 'portability', 'objection'].includes(requestType)) findings.push('request_type_invalid');
  if (!identityVerified) findings.push('identity_verification_required');
  if (!scope.length) findings.push('scope_required');
  return { valid: findings.length === 0, findings, request: { requestType, scope, eligibleForHumanReview: findings.length === 0, responseSent: false, exportGenerated: false } };
}

export const RUNTIME_WAVE_8_RELEASE = 'runtime-wave-8.0.0';
export const RUNTIME_WAVE_8_SIDE_EFFECTS = Object.freeze({
  personalDataStored: false,
  deletionExecuted: false,
  exportsGenerated: false,
  residencyChanged: false,
  productionWritesEnabled: false,
  paidPrivacyServicesEnabled: false
});
const routes = {
  '/api/v1/runtime/v8/data/classify': dataClassify,
  '/api/v1/runtime/v8/retention/evaluate': retentionEvaluate,
  '/api/v1/runtime/v8/deletion/plan': deletionPlan,
  '/api/v1/runtime/v8/residency/assess': residencyAssess,
  '/api/v1/runtime/v8/dsar/validate': dsarValidate
};
export const handleRuntimeWave8 = createWaveHandler({
  wave: 8,
  release: RUNTIME_WAVE_8_RELEASE,
  mode: 'private-owner-privacy-data-lifecycle-evaluation-only',
  sideEffects: RUNTIME_WAVE_8_SIDE_EFFECTS,
  routes
});
export const __testWave8 = { dataClassify, retentionEvaluate, deletionPlan, residencyAssess, dsarValidate };

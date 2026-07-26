import { array, bool, clean, createWaveHandler, number } from './core.js';

function modelCard(input = {}) {
  const findings = [];
  const name = clean(input.name, 160);
  const version = clean(input.version, 100);
  const owner = clean(input.owner, 254);
  const intendedUse = clean(input.intendedUse, 1000);
  const prohibitedUses = array(input.prohibitedUses, 30).map((v) => clean(v, 300)).filter(Boolean);
  const limitations = array(input.limitations, 30).map((v) => clean(v, 300)).filter(Boolean);
  const evaluationSets = array(input.evaluationSets, 30).map((v) => clean(v, 160)).filter(Boolean);
  if (!name) findings.push('model_name_required');
  if (!version) findings.push('model_version_required');
  if (!owner.includes('@')) findings.push('accountable_owner_required');
  if (intendedUse.length < 20) findings.push('intended_use_too_short');
  if (!prohibitedUses.length) findings.push('prohibited_use_required');
  if (!limitations.length) findings.push('limitation_required');
  if (!evaluationSets.length) findings.push('evaluation_set_required');
  return {
    valid: findings.length === 0,
    findings,
    modelCard: { name, version, owner, intendedUse, prohibitedUses, limitations, evaluationSets, approved: false, registered: false, deployed: false }
  };
}

function evaluationAssurance(input = {}) {
  const findings = [];
  const metrics = array(input.metrics, 100).map((item, index) => {
    const name = clean(item?.name, 100);
    const score = number(item?.score, 0, 1, 0);
    const threshold = number(item?.threshold, 0, 1, 1);
    if (!name) findings.push(`metric_${index}_name_required`);
    return { name, score, threshold, passed: score >= threshold };
  });
  if (!metrics.length) findings.push('metric_required');
  const redTeam = bool(input.redTeamCompleted);
  const safetyReview = bool(input.safetyReviewCompleted);
  if (!redTeam) findings.push('red_team_evidence_required');
  if (!safetyReview) findings.push('safety_review_required');
  return {
    valid: findings.length === 0,
    findings,
    assessment: {
      metrics,
      decision: findings.length || metrics.some((m) => !m.passed) ? 'block' : 'eligible-for-human-approval',
      modelExecuted: false,
      benchmarkFetched: false,
      deployed: false
    }
  };
}

function modelRisk(input = {}) {
  const impact = clean(input.impact, 30).toLowerCase();
  const autonomy = clean(input.autonomy, 30).toLowerCase();
  const dataSensitivity = clean(input.dataSensitivity, 30).toLowerCase();
  const regulated = bool(input.regulatedUse);
  const findings = [];
  if (!['low', 'medium', 'high', 'critical'].includes(impact)) findings.push('impact_invalid');
  if (!['none', 'assistive', 'bounded', 'autonomous'].includes(autonomy)) findings.push('autonomy_invalid');
  if (!['public', 'internal', 'confidential', 'restricted'].includes(dataSensitivity)) findings.push('data_sensitivity_invalid');
  let tier = 1;
  if (impact === 'critical' || autonomy === 'autonomous' || regulated) tier = 4;
  else if (impact === 'high' || autonomy === 'bounded' || dataSensitivity === 'restricted') tier = 3;
  else if (impact === 'medium' || dataSensitivity === 'confidential') tier = 2;
  return { valid: findings.length === 0, findings, classification: { tier, humanApprovalRequired: tier >= 2, deploymentAllowed: false } };
}

function modelChangeGate(input = {}) {
  const evidence = input.evidence && typeof input.evidence === 'object' ? input.evidence : {};
  const required = ['modelCard', 'evaluation', 'redTeam', 'privacy', 'security', 'rollback'];
  const findings = [];
  for (const key of required) if (evidence[key] !== 'pass') findings.push(`${key}_evidence_not_passed`);
  if (bool(input.autoDeployRequested)) findings.push('automatic_deployment_denied');
  return {
    valid: findings.length === 0,
    findings,
    gate: { decision: findings.length ? 'block' : 'eligible-for-human-approval', humanApprovalRequired: true, deployed: false, registryWritten: false }
  };
}

export const RUNTIME_WAVE_7_RELEASE = 'runtime-wave-7.0.0';
export const RUNTIME_WAVE_7_SIDE_EFFECTS = Object.freeze({
  modelExecutionEnabled: false,
  externalBenchmarksEnabled: false,
  modelRegistryWritesEnabled: false,
  deploymentChangesEnabled: false,
  productionWritesEnabled: false,
  paidEvaluationEnabled: false
});
const routes = {
  '/api/v1/runtime/v7/model-card/validate': modelCard,
  '/api/v1/runtime/v7/evaluation/assess': evaluationAssurance,
  '/api/v1/runtime/v7/risk/classify': modelRisk,
  '/api/v1/runtime/v7/change/gate': modelChangeGate
};
export const handleRuntimeWave7 = createWaveHandler({
  wave: 7,
  release: RUNTIME_WAVE_7_RELEASE,
  mode: 'private-owner-model-governance-evaluation-only',
  sideEffects: RUNTIME_WAVE_7_SIDE_EFFECTS,
  routes
});
export const __testWave7 = { modelCard, evaluationAssurance, modelRisk, modelChangeGate };

import { array, bool, clean, createWaveHandler, number } from './core.js';

function biaAssess(input = {}) {
  const services = array(input.services, 200);
  const findings = [];
  const assessed = services.map((service, index) => {
    const name = clean(service?.name, 160);
    const impact = clean(service?.impact, 30).toLowerCase();
    const rtoMinutes = Math.floor(number(service?.rtoMinutes, 0, 525600, 0));
    const rpoMinutes = Math.floor(number(service?.rpoMinutes, 0, 525600, 0));
    if (!name) findings.push(`service_${index}_name_required`);
    if (!['low', 'medium', 'high', 'critical'].includes(impact)) findings.push(`service_${index}_impact_invalid`);
    if (rtoMinutes < 1) findings.push(`service_${index}_rto_required`);
    return { name, impact, rtoMinutes, rpoMinutes };
  });
  if (!assessed.length) findings.push('service_required');
  return { valid: findings.length === 0, findings, assessment: { services: assessed, infrastructureChanged: false, failoverExecuted: false } };
}

function recoveryPlan(input = {}) {
  const steps = array(input.steps, 100).map((v) => clean(v, 500)).filter(Boolean);
  const owners = array(input.owners, 50).map((v) => clean(v, 254)).filter(Boolean);
  const verification = array(input.verification, 50).map((v) => clean(v, 300)).filter(Boolean);
  const findings = [];
  if (steps.length < 3) findings.push('minimum_three_recovery_steps_required');
  if (!owners.length) findings.push('owner_required');
  if (!verification.length) findings.push('verification_step_required');
  return { valid: findings.length === 0, findings, plan: { steps, owners, verification, executed: false, infrastructureChanged: false } };
}

function dependencyMap(input = {}) {
  const nodes = array(input.nodes, 300).map((v) => clean(v, 160)).filter(Boolean);
  const edges = array(input.edges, 1000);
  const findings = [];
  const nodeSet = new Set(nodes);
  const mapped = edges.map((edge, index) => {
    const from = clean(edge?.from, 160);
    const to = clean(edge?.to, 160);
    if (!nodeSet.has(from) || !nodeSet.has(to)) findings.push(`edge_${index}_unknown_node`);
    if (from === to) findings.push(`edge_${index}_self_reference`);
    return { from, to, critical: bool(edge?.critical) };
  });
  if (!nodes.length) findings.push('node_required');
  return { valid: findings.length === 0, findings, map: { nodes, edges: mapped, externalDiscoveryPerformed: false, systemsChanged: false } };
}

function tabletopEvaluate(input = {}) {
  const scenario = clean(input.scenario, 1000);
  const participants = array(input.participants, 100).map((v) => clean(v, 160)).filter(Boolean);
  const observations = array(input.observations, 100).map((v) => clean(v, 500)).filter(Boolean);
  const actions = array(input.actions, 100).map((v) => clean(v, 500)).filter(Boolean);
  const findings = [];
  if (scenario.length < 30) findings.push('scenario_too_short');
  if (participants.length < 2) findings.push('minimum_two_participants_required');
  if (!observations.length) findings.push('observation_required');
  if (!actions.length) findings.push('action_required');
  return { valid: findings.length === 0, findings, exercise: { scenario, participantCount: participants.length, observations, actions, failoverExecuted: false, alertsSent: false } };
}

function continuityGate(input = {}) {
  const evidence = input.evidence && typeof input.evidence === 'object' ? input.evidence : {};
  const required = ['bia', 'dependencyMap', 'recoveryPlan', 'backupReview', 'tabletop', 'communications'];
  const findings = [];
  for (const key of required) if (evidence[key] !== 'pass') findings.push(`${key}_evidence_not_passed`);
  if (bool(input.autoFailoverRequested)) findings.push('automatic_failover_denied');
  return { valid: findings.length === 0, findings, gate: { decision: findings.length ? 'block' : 'eligible-for-human-approval', failoverExecuted: false, recoveryExecuted: false } };
}

export const RUNTIME_WAVE_10_RELEASE = 'runtime-wave-10.0.0';
export const RUNTIME_WAVE_10_SIDE_EFFECTS = Object.freeze({
  failoverExecuted: false,
  disasterRecoveryExecuted: false,
  infrastructureChanged: false,
  alertsSent: false,
  productionWritesEnabled: false,
  paidResilienceServicesEnabled: false
});
const routes = {
  '/api/v1/runtime/v10/bia/assess': biaAssess,
  '/api/v1/runtime/v10/recovery/plan': recoveryPlan,
  '/api/v1/runtime/v10/dependency/map': dependencyMap,
  '/api/v1/runtime/v10/tabletop/evaluate': tabletopEvaluate,
  '/api/v1/runtime/v10/continuity/gate': continuityGate
};
export const handleRuntimeWave10 = createWaveHandler({
  wave: 10,
  release: RUNTIME_WAVE_10_RELEASE,
  mode: 'private-owner-resilience-continuity-planning-only',
  sideEffects: RUNTIME_WAVE_10_SIDE_EFFECTS,
  routes
});
export const __testWave10 = { biaAssess, recoveryPlan, dependencyMap, tabletopEvaluate, continuityGate };

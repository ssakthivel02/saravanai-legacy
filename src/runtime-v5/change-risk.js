import { clean } from './core.js';
const SCOPES = new Set(['documentation', 'frontend', 'worker-route', 'identity', 'database', 'security', 'infrastructure']);

export function evaluateChangeRisk(input = {}) {
  const changeId = clean(input.changeId, 100);
  const scope = clean(input.scope, 40).toLowerCase();
  const findings = [];
  if (!changeId) findings.push('change_id_required');
  if (!SCOPES.has(scope)) findings.push('scope_not_allowlisted');
  let score = 0;
  if (['identity', 'database', 'security', 'infrastructure'].includes(scope)) score += 35;
  else if (scope === 'worker-route') score += 20;
  else if (scope === 'frontend') score += 10;
  if (input.dataMigration === true) score += 25;
  if (input.publicExposure === true) score += 20;
  if (input.rollbackTested !== true) score += 15;
  if (input.automatedTestsPassed !== true) score += 15;
  score = Math.min(100, score);
  const risk = score >= 70 ? 'critical' : score >= 45 ? 'high' : score >= 20 ? 'medium' : 'low';
  return {
    valid: findings.length === 0,
    findings,
    evaluation: { changeId, scope, score, risk, humanApprovalRequired: risk !== 'low', changeExecuted: false, persisted: false }
  };
}

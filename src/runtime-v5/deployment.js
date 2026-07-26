import { boundedNumber, clean } from './core.js';

export function evaluateDeploymentGate(input = {}) {
  const releaseId = clean(input.releaseId, 120);
  const errorBudgetRemainingPercent = boundedNumber(input.errorBudgetRemainingPercent, -1000, 100, 0);
  const findings = [];
  if (!releaseId) findings.push('release_id_required');
  if (input.testsPassed !== true) findings.push('tests_not_passed');
  if (input.securityValidationPassed !== true) findings.push('security_validation_not_passed');
  if (input.rollbackPlanVerified !== true) findings.push('rollback_plan_not_verified');
  if (errorBudgetRemainingPercent < 0) findings.push('error_budget_exhausted');
  if (input.productionWritesRequested === true) findings.push('production_write_request_denied');
  return {
    valid: findings.length === 0,
    findings,
    gate: {
      releaseId,
      decision: findings.length === 0 ? 'eligible-for-human-approval' : 'blocked',
      humanApprovalRequired: true,
      deploymentExecuted: false,
      trafficShifted: false,
      rollbackExecuted: false
    }
  };
}

export function buildRollbackPlan(input = {}) {
  const releaseId = clean(input.releaseId, 120);
  const previousVersion = clean(input.previousVersion, 120);
  const reason = clean(input.reason, 500);
  const findings = [];
  if (!releaseId) findings.push('release_id_required');
  if (!previousVersion) findings.push('previous_version_required');
  if (!reason) findings.push('reason_required');
  return {
    valid: findings.length === 0,
    findings,
    plan: {
      releaseId,
      previousVersion,
      reason,
      steps: ['freeze-new-changes', 'capture-current-metrics', 'restore-previous-version', 'verify-health', 'document-outcome'],
      requiresHumanApproval: true,
      rollbackExecuted: false,
      commandsGenerated: false
    }
  };
}

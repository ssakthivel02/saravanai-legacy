import { clean } from './core.js';

export function evaluateRepositoryPolicy(input = {}) {
  const defaultBranch = clean(input.defaultBranch, 100);
  const requiredChecks = Array.isArray(input.requiredChecks) ? input.requiredChecks.slice(0, 100).map((v) => clean(v, 160)).filter(Boolean) : [];
  const findings = [];
  if (!defaultBranch) findings.push('default_branch_required');
  if (input.branchProtectionEnabled !== true) findings.push('branch_protection_required');
  if (Number(input.requiredApprovals || 0) < 1) findings.push('approval_required');
  if (!requiredChecks.length) findings.push('required_status_check_required');
  if (input.forcePushAllowed === true) findings.push('force_push_must_be_disabled');
  if (input.deletionAllowed === true) findings.push('protected_branch_deletion_must_be_disabled');
  if (input.dismissStaleReviews !== true) findings.push('stale_review_dismissal_required');

  return {
    valid: findings.length === 0,
    findings,
    policy: {
      defaultBranch,
      requiredChecks,
      decision: findings.length ? 'remediation-required' : 'meets-baseline',
      repositoryChanged: false,
      branchProtectionChanged: false,
      persisted: false
    }
  };
}

import { boundedNumber, clean } from './core.js';

export function validateRiskException(input = {}) {
  const controlId = clean(input.controlId, 120);
  const rationale = clean(input.rationale, 1000);
  const owner = clean(input.owner, 254).toLowerCase();
  const compensatingControls = Array.isArray(input.compensatingControls)
    ? input.compensatingControls.slice(0, 20).map((v) => clean(v, 300)).filter(Boolean)
    : [];
  const durationDays = Math.floor(boundedNumber(input.durationDays, 0, 365, 0));
  const findings = [];
  if (!controlId) findings.push('control_id_required');
  if (rationale.length < 20) findings.push('rationale_too_short');
  if (!owner.includes('@')) findings.push('owner_email_invalid');
  if (!compensatingControls.length) findings.push('compensating_control_required');
  if (durationDays < 1 || durationDays > 90) findings.push('duration_must_be_1_to_90_days');

  return {
    valid: findings.length === 0,
    findings,
    exception: {
      controlId,
      owner,
      durationDays,
      compensatingControls,
      decision: findings.length ? 'reject' : 'eligible-for-human-approval',
      automaticallyApproved: false,
      policyBypassed: false,
      persisted: false
    }
  };
}

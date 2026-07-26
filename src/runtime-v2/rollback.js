import { text } from './shared.js';

const ALLOWED_ACTIONS = new Set([
  'disable-feature-flag',
  'revoke-proposed-lease',
  'restore-previous-config',
  'quarantine-output',
  'notify-owner'
]);

export function buildRollbackPlan(input = {}) {
  const changeId = text(input.changeId, 120);
  const requested = Array.isArray(input.actions) ? input.actions.slice(0, 6) : [];
  const actions = requested.map((action, index) => {
    const type = text(action?.type, 80);
    return {
      sequence: index + 1,
      type,
      allowed: ALLOWED_ACTIONS.has(type),
      instruction: text(action?.instruction, 300),
      automated: false
    };
  });

  const findings = [];
  if (!changeId) findings.push('change_id_required');
  if (!actions.length) findings.push('rollback_action_required');
  if (actions.some((action) => !action.allowed)) findings.push('rollback_action_not_allowlisted');

  return {
    valid: findings.length === 0,
    changeId,
    findings,
    actions,
    executionAllowed: false,
    humanConfirmationRequired: true,
    productionWriteAllowed: false
  };
}

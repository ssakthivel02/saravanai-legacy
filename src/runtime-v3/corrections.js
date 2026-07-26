import { cleanText } from './shared.js';

const ACTIONS = new Set([
  'mark-claim-disputed',
  'replace-source-reference',
  'request-human-review',
  'rebuild-citation-map',
  'quarantine-output',
  'publish-correction-notice'
]);

export function buildCorrectionPlan(input = {}) {
  const targetId = cleanText(input.targetId, 120);
  const reason = cleanText(input.reason, 1000);
  const requested = Array.isArray(input.actions) ? input.actions.slice(0, 8) : [];
  const findings = [];

  if (!targetId) findings.push('target_id_required');
  if (!reason) findings.push('reason_required');
  if (!requested.length) findings.push('correction_action_required');

  const actions = requested.map((action, index) => {
    const type = cleanText(action?.type, 100);
    const allowed = ACTIONS.has(type);
    if (!allowed) findings.push(`action_${index + 1}_not_allowlisted`);
    return {
      sequence: index + 1,
      type,
      allowed,
      instruction: cleanText(action?.instruction, 500),
      automated: false
    };
  });

  return {
    valid: findings.length === 0,
    findings,
    targetId,
    reason,
    actions,
    executionAllowed: false,
    publicationAllowed: false,
    humanApprovalRequired: true
  };
}

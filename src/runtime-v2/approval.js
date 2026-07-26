import { text } from './shared.js';

const HIGH_RISK = new Set(['external-communication', 'deployment', 'data-deletion', 'credential-change', 'financial-action']);
const MEDIUM_RISK = new Set(['research-publication', 'customer-export', 'configuration-change']);

export function classifyApproval(input = {}) {
  const actionClass = text(input.actionClass, 100).toLowerCase();
  const claimedApprover = text(input.approver, 254);
  const findings = [];

  let required = 'owner-review';
  if (HIGH_RISK.has(actionClass)) required = 'independent-four-eyes-review';
  else if (MEDIUM_RISK.has(actionClass)) required = 'explicit-owner-approval';

  if (!actionClass) findings.push('action_class_required');
  if (input.approved === true) findings.push('wave2_cannot_grant_approval');
  if (claimedApprover) findings.push('unverified_approver_claim_ignored');

  return {
    valid: findings.length === 0,
    actionClass,
    required,
    findings,
    approvalGranted: false,
    approvalCanBeGrantedByThisEndpoint: false,
    evidenceRequired: [
      'human identity',
      'decision timestamp',
      'purpose and scope',
      'risk acceptance',
      'rollback acknowledgement'
    ]
  };
}

import { clean } from './core.js';
const ROLES = new Set(['administrator', 'reviewer', 'contributor', 'viewer']);

export function validateMembership(input = {}) {
  const email = clean(input.email, 254).toLowerCase();
  const role = clean(input.role, 50).toLowerCase();
  const justification = clean(input.justification, 500);
  const findings = [];
  if (!email.includes('@') || !email.includes('.')) findings.push('email_invalid');
  if (!ROLES.has(role)) findings.push('role_not_allowlisted');
  if (!justification) findings.push('justification_required');
  if (input.sendInvitation === true) findings.push('invitation_sending_denied');
  return {
    valid: findings.length === 0,
    findings,
    proposal: {
      emailMasked: email ? `${email.slice(0, 2)}***@${email.split('@')[1] || ''}` : null,
      role,
      justification,
      invitationSent: false,
      membershipCreated: false,
      humanApprovalRequired: true
    }
  };
}

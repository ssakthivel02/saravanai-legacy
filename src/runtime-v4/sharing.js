import { clean } from './core.js';
const AUDIENCES = new Set(['workspace-members', 'named-reviewers', 'owner-only']);
const TYPES = new Set(['document', 'evidence-packet', 'report-preview', 'configuration-preview']);

export function validateSharing(input = {}) {
  const resourceId = clean(input.resourceId, 120);
  const resourceType = clean(input.resourceType, 80).toLowerCase();
  const audience = clean(input.audience, 80).toLowerCase();
  const expiryHours = Math.max(1, Math.min(168, Number(input.expiryHours || 24)));
  const findings = [];
  if (!resourceId) findings.push('resource_id_required');
  if (!TYPES.has(resourceType)) findings.push('resource_type_not_allowlisted');
  if (!AUDIENCES.has(audience)) findings.push('audience_not_allowlisted');
  if (input.publicLink === true) findings.push('public_link_denied');
  return { valid: findings.length === 0, findings, proposal: { resourceId, resourceType, audience, expiryHours, publicLink: false, linkCreated: false, accessGranted: false } };
}

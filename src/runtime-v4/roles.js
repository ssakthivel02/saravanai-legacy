import { clean } from './core.js';
const PERMISSIONS = new Set([
  'workspace.read', 'workspace.configure-preview', 'content.read', 'content.propose',
  'evidence.review', 'audit.read', 'trust-centre.read'
]);

export function validateRole(input = {}) {
  const roleId = clean(input.roleId, 80).toLowerCase();
  const permissions = Array.isArray(input.permissions) ? input.permissions.slice(0, 20).map((p) => clean(p, 100).toLowerCase()) : [];
  const findings = [];
  if (!roleId) findings.push('role_id_required');
  if (!permissions.length) findings.push('permission_required');
  if (permissions.some((p) => !PERMISSIONS.has(p))) findings.push('permission_not_allowlisted');
  return { valid: findings.length === 0, findings, role: { roleId, permissions: [...new Set(permissions)], denyByDefault: true, applied: false, persisted: false } };
}

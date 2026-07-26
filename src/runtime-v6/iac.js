import { clean } from './core.js';

const RESOURCE_TYPES = new Set(['object-storage', 'database', 'firewall-rule', 'identity-policy', 'compute', 'queue', 'secret-store']);

export function evaluateIac(input = {}) {
  const resources = Array.isArray(input.resources) ? input.resources.slice(0, 300) : [];
  const findings = [];
  if (!resources.length) findings.push('resource_required');

  const results = resources.map((resource, index) => {
    const id = clean(resource?.id, 120);
    const type = clean(resource?.type, 60).toLowerCase();
    const violations = [];
    if (!id) findings.push(`resource_${index}_id_required`);
    if (!RESOURCE_TYPES.has(type)) findings.push(`resource_${index}_type_not_allowlisted`);
    if (resource?.public === true && ['object-storage', 'database', 'secret-store'].includes(type)) violations.push('public_sensitive_resource');
    if (resource?.encryptedAtRest === false && ['object-storage', 'database', 'secret-store'].includes(type)) violations.push('encryption_at_rest_required');
    if (type === 'firewall-rule' && resource?.source === '0.0.0.0/0' && [22, 3389].includes(Number(resource?.port))) violations.push('public_admin_port');
    if (type === 'identity-policy' && Array.isArray(resource?.actions) && resource.actions.includes('*')) violations.push('wildcard_identity_action');
    if (type === 'database' && resource?.backupEnabled === false) violations.push('database_backup_required');
    return { id, type, violations, blocked: violations.length > 0 };
  });

  return {
    valid: findings.length === 0,
    findings,
    assessment: {
      resources: results,
      violationCount: results.reduce((sum, item) => sum + item.violations.length, 0),
      decision: results.some((item) => item.blocked) ? 'block' : 'review',
      infrastructureChanged: false,
      externalPolicyEngineUsed: false,
      persisted: false
    }
  };
}

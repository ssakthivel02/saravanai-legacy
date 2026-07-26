import { clean } from './core.js';
const STATES = new Set(['healthy', 'degraded', 'unavailable', 'unknown']);

export function aggregateHealth(input = {}) {
  const components = Array.isArray(input.components) ? input.components.slice(0, 50) : [];
  const findings = [];
  const normalized = components.map((component) => {
    const name = clean(component?.name, 100);
    const status = clean(component?.status, 30).toLowerCase();
    if (!name) findings.push('component_name_required');
    if (!STATES.has(status)) findings.push('component_status_not_allowlisted');
    return { name, status: STATES.has(status) ? status : 'unknown' };
  });
  let overall = 'healthy';
  if (!normalized.length) { findings.push('component_required'); overall = 'unknown'; }
  else if (normalized.some((c) => c.status === 'unavailable')) overall = 'unavailable';
  else if (normalized.some((c) => c.status === 'degraded' || c.status === 'unknown')) overall = 'degraded';
  return { valid: findings.length === 0, findings: [...new Set(findings)], aggregate: { overall, components: normalized, externalProbeExecuted: false, persisted: false } };
}

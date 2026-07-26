import { clean } from './core.js';
const REGIONS = new Set(['uk', 'eu', 'india', 'global']);
const ZONES = new Set(['private', 'internal', 'restricted']);

export function validateWorkspace(input = {}) {
  const name = clean(input.name, 120);
  const slug = clean(input.slug, 80).toLowerCase();
  const region = clean(input.region, 30).toLowerCase();
  const dataZone = clean(input.dataZone, 30).toLowerCase();
  const findings = [];
  if (!name) findings.push('name_required');
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/.test(slug)) findings.push('slug_invalid');
  if (!REGIONS.has(region)) findings.push('region_not_allowlisted');
  if (!ZONES.has(dataZone)) findings.push('data_zone_not_allowlisted');
  if (input.public === true) findings.push('public_workspace_denied');
  return { valid: findings.length === 0, findings, proposal: { name, slug, region, dataZone, visibility: 'private', createWorkspace: false, persisted: false } };
}

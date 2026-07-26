import { clean } from './core.js';

const FORMATS = new Set(['cyclonedx-json', 'spdx-json']);
const TYPES = new Set(['application', 'library', 'framework', 'container', 'operating-system', 'file']);

export function validateSbom(input = {}) {
  const format = clean(input.format, 40).toLowerCase();
  const components = Array.isArray(input.components) ? input.components.slice(0, 500) : [];
  const findings = [];
  if (!FORMATS.has(format)) findings.push('sbom_format_not_allowlisted');
  if (!components.length) findings.push('component_required');

  const seen = new Set();
  const normalized = components.map((component, index) => {
    const name = clean(component?.name, 160);
    const version = clean(component?.version, 100);
    const type = clean(component?.type, 50).toLowerCase();
    const purl = clean(component?.purl, 500);
    if (!name) findings.push(`component_${index}_name_required`);
    if (!version) findings.push(`component_${index}_version_required`);
    if (!TYPES.has(type)) findings.push(`component_${index}_type_not_allowlisted`);
    if (purl && !purl.startsWith('pkg:')) findings.push(`component_${index}_purl_invalid`);
    const key = `${name.toLowerCase()}@${version}`;
    if (seen.has(key)) findings.push(`component_${index}_duplicate`);
    seen.add(key);
    return { name, version, type, purl: purl || null };
  });

  return {
    valid: findings.length === 0,
    findings: [...new Set(findings)],
    summary: {
      format,
      componentCount: normalized.length,
      uniqueComponentCount: seen.size,
      components: normalized,
      generated: false,
      persisted: false,
      completenessClaim: false
    }
  };
}

import { clean } from './core.js';

const ALLOW = new Set(['mit', 'apache-2.0', 'bsd-2-clause', 'bsd-3-clause', 'isc', 'mpl-2.0']);
const REVIEW = new Set(['gpl-2.0', 'gpl-3.0', 'agpl-3.0', 'lgpl-2.1', 'lgpl-3.0', 'sspl-1.0', 'bsl-1.1', 'unlicense']);

export function assessLicenses(input = {}) {
  const components = Array.isArray(input.components) ? input.components.slice(0, 500) : [];
  const findings = [];
  if (!components.length) findings.push('component_required');

  const results = components.map((component, index) => {
    const name = clean(component?.name, 160);
    const license = clean(component?.license, 80).toLowerCase();
    if (!name) findings.push(`component_${index}_name_required`);
    if (!license) findings.push(`component_${index}_license_required`);
    const disposition = ALLOW.has(license) ? 'allowlisted' : REVIEW.has(license) ? 'legal-review-required' : 'unknown-review-required';
    return { name, license, disposition };
  });

  return {
    valid: findings.length === 0,
    findings,
    assessment: {
      components: results,
      reviewRequired: results.some((item) => item.disposition !== 'allowlisted'),
      legalConclusionProvided: false,
      policyApplied: false,
      persisted: false
    }
  };
}

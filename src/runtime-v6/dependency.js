import { boundedNumber, clean } from './core.js';

const SEVERITIES = new Set(['none', 'low', 'medium', 'high', 'critical']);

export function assessDependencies(input = {}) {
  const dependencies = Array.isArray(input.dependencies) ? input.dependencies.slice(0, 500) : [];
  const findings = [];
  if (!dependencies.length) findings.push('dependency_required');

  const results = dependencies.map((dependency, index) => {
    const name = clean(dependency?.name, 160);
    const version = clean(dependency?.version, 100);
    const severity = clean(dependency?.severity, 30).toLowerCase();
    const cvss = boundedNumber(dependency?.cvss, 0, 10, 0);
    const knownExploited = dependency?.knownExploited === true;
    const mitigation = clean(dependency?.mitigation, 500);
    if (!name) findings.push(`dependency_${index}_name_required`);
    if (!version) findings.push(`dependency_${index}_version_required`);
    if (!SEVERITIES.has(severity)) findings.push(`dependency_${index}_severity_not_allowlisted`);
    const blocked = knownExploited || severity === 'critical' || (severity === 'high' && !mitigation);
    return { name, version, severity, cvss, knownExploited, mitigation: mitigation || null, blocked };
  });

  return {
    valid: findings.length === 0,
    findings,
    assessment: {
      dependencies: results,
      blockedCount: results.filter((item) => item.blocked).length,
      decision: results.some((item) => item.blocked) ? 'block' : 'review',
      externalLookupPerformed: false,
      packageInstalled: false,
      persisted: false
    }
  };
}

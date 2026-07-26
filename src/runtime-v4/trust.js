import { clean } from './core.js';
const LANGUAGES = new Set(['en', 'ta', 'hi']);
const REQUIREMENTS = new Set(['keyboard', 'screen-reader', 'high-contrast', 'captions', 'plain-language', 'reduced-motion']);

export function validateAccessibility(input = {}) {
  const language = clean(input.language, 20).toLowerCase();
  const requirements = Array.isArray(input.requirements) ? input.requirements.slice(0, 10).map((v) => clean(v, 80).toLowerCase()) : [];
  const findings = [];
  if (!LANGUAGES.has(language)) findings.push('language_not_allowlisted');
  if (!requirements.length) findings.push('accessibility_requirement_required');
  if (requirements.some((r) => !REQUIREMENTS.has(r))) findings.push('accessibility_requirement_not_allowlisted');
  return { valid: findings.length === 0, findings, profile: { language, requirements: [...new Set(requirements)], applied: false, wcagCertificationClaim: false } };
}

export function trustSnapshot() {
  return {
    publicRegistration: false,
    productionWrites: false,
    paidProviders: false,
    billing: false,
    autonomousActions: false,
    workspaceWrites: false,
    invitationSending: false,
    exportGeneration: false,
    claims: { certified: false, independentlyAudited: false, productionReady: false },
    controls: ['private-owner-boundary', 'deny-by-default-role-policy', 'metadata-only-export-review', 'privacy-safe-audit-envelope']
  };
}

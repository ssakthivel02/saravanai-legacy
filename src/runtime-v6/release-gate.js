import { clean } from './core.js';

const REQUIRED = ['tests', 'secrets', 'dependencies', 'sbom', 'provenance', 'iac', 'licenses', 'workflow'];

export function evaluateReleaseGate(input = {}) {
  const releaseId = clean(input.releaseId, 120);
  const evidence = input.evidence && typeof input.evidence === 'object' ? input.evidence : {};
  const findings = [];
  if (!releaseId) findings.push('release_id_required');
  for (const key of REQUIRED) {
    if (!Object.hasOwn(evidence, key)) findings.push(`${key}_evidence_missing`);
    else if (evidence[key] !== 'pass') findings.push(`${key}_evidence_not_passed`);
  }
  if (input.productionWriteRequested === true) findings.push('production_write_request_denied');
  if (input.autoMergeRequested === true) findings.push('automatic_merge_denied');

  return {
    valid: findings.length === 0,
    findings,
    gate: {
      releaseId,
      requiredEvidence: REQUIRED,
      decision: findings.length ? 'block' : 'eligible-for-human-approval',
      humanApprovalRequired: true,
      autoMergeExecuted: false,
      deploymentExecuted: false,
      productionWriteExecuted: false,
      persisted: false
    }
  };
}

import { clean } from './core.js';

const BUILDERS = new Set(['github-actions', 'cloudflare-builds', 'local-reviewed-build']);

export function validateProvenance(input = {}) {
  const repository = clean(input.repository, 240).toLowerCase();
  const commitSha = clean(input.commitSha, 64).toLowerCase();
  const builder = clean(input.builder, 80).toLowerCase();
  const workflowRef = clean(input.workflowRef, 300);
  const artifactSha256 = clean(input.artifactSha256, 64).toLowerCase();
  const branch = clean(input.branch, 100);
  const findings = [];
  if (!/^https:\/\/github\.com\/[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(repository)) findings.push('repository_url_invalid');
  if (!/^[a-f0-9]{40}$/.test(commitSha)) findings.push('commit_sha_invalid');
  if (!BUILDERS.has(builder)) findings.push('builder_not_allowlisted');
  if (!workflowRef) findings.push('workflow_ref_required');
  if (!/^[a-f0-9]{64}$/.test(artifactSha256)) findings.push('artifact_digest_invalid');
  if (!branch) findings.push('branch_required');
  if (input.signed === true && !input.signatureVerified) findings.push('signature_claim_unverified');

  return {
    valid: findings.length === 0,
    findings,
    provenance: {
      repository,
      commitSha,
      builder,
      workflowRef,
      artifactSha256,
      branch,
      signatureVerified: input.signatureVerified === true,
      attestationCreated: false,
      artifactSigned: false,
      persisted: false
    }
  };
}

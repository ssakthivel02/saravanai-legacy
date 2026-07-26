import { boundedNumber, clean } from './core.js';

const EXTENSIONS = new Set(['zip', 'json', 'txt', 'md', 'js', 'mjs', 'yaml', 'yml', 'sql', 'html', 'css', 'png', 'jpg', 'webp']);

export function validateArtifact(input = {}) {
  const name = clean(input.name, 240);
  const sha256 = clean(input.sha256, 64).toLowerCase();
  const sizeBytes = Math.floor(boundedNumber(input.sizeBytes, 0, 2_000_000_000, 0));
  const extension = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  const findings = [];
  if (!name) findings.push('artifact_name_required');
  if (!/^[a-f0-9]{64}$/.test(sha256)) findings.push('artifact_digest_invalid');
  if (sizeBytes <= 0) findings.push('artifact_size_required');
  if (!EXTENSIONS.has(extension)) findings.push('artifact_extension_not_allowlisted');
  if (input.executable === true) findings.push('executable_artifact_denied');

  return {
    valid: findings.length === 0,
    findings,
    artifact: {
      name,
      sha256,
      sizeBytes,
      extension,
      integrityMetadataPresent: /^[a-f0-9]{64}$/.test(sha256),
      downloaded: false,
      executed: false,
      signed: false,
      persisted: false
    }
  };
}

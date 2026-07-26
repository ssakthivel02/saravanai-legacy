import { clean, sha256 } from './core.js';

const PATTERNS = [
  { id: 'private-key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i },
  { id: 'github-token', pattern: /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/ },
  { id: 'aws-access-key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: 'bearer-token', pattern: /\bBearer\s+[A-Za-z0-9._~+\/=-]{16,}\b/i },
  { id: 'password-assignment', pattern: /\bpassword\s*[:=]\s*['"]?[^'"\s]{8,}/i },
  { id: 'api-key-assignment', pattern: /\bapi[_-]?key\s*[:=]\s*['"]?[^'"\s]{12,}/i }
];

export async function inspectSecretMarkers(input = {}) {
  const content = clean(input.content, 20000);
  const path = clean(input.path, 300);
  const findings = [];
  if (!path) findings.push('path_required');
  if (!content) findings.push('content_required');

  const matches = PATTERNS.filter(({ pattern }) => pattern.test(content)).map(({ id }) => id);
  let redacted = content;
  for (const { pattern } of PATTERNS) redacted = redacted.replace(pattern, '[SECRET_REDACTED]');

  return {
    valid: findings.length === 0,
    findings,
    inspection: {
      path,
      matchTypes: matches,
      suspectedSecretCount: matches.length,
      decision: matches.length ? 'block-and-rotate-review' : 'no-marker-detected',
      redactedPreview: redacted.slice(0, 1000),
      contentFingerprint: content ? (await sha256(content)).slice(0, 24) : null,
      exhaustiveDetectionClaim: false,
      repositoryScanned: false,
      persisted: false
    }
  };
}

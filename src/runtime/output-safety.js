const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bAIza[A-Za-z0-9_-]{20,}\b/,
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password)\b\s*[:=]/i
];

const PII_PATTERNS = [
  { id: 'email', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
  { id: 'phone', pattern: /(?:\+?\d[\d\s().-]{7,}\d)/ },
  { id: 'uk_nino_candidate', pattern: /\b[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]\b/i }
];

const UNSUPPORTED_CLAIM_PATTERNS = [
  /\b(certified|fully compliant|guaranteed compliant)\b/i,
  /\b(i deployed|we deployed|deployment completed)\b/i,
  /\b(files? (?:were|have been) uploaded)\b/i
];

export function assessOutputSafety(output = '') {
  const value = typeof output === 'string' ? output.slice(0, 50000) : '';
  const findings = [];

  if (!value.trim()) findings.push({ severity: 'error', code: 'OUTPUT_REQUIRED' });

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(value)) {
      findings.push({ severity: 'block', code: 'SECRET_DISCLOSURE_RISK' });
      break;
    }
  }

  for (const item of PII_PATTERNS) {
    if (item.pattern.test(value)) {
      findings.push({
        severity: 'review',
        code: `PII_${item.id.toUpperCase()}_DETECTED`
      });
    }
  }

  for (const pattern of UNSUPPORTED_CLAIM_PATTERNS) {
    if (pattern.test(value)) {
      findings.push({
        severity: 'review',
        code: 'UNSUPPORTED_OPERATIONAL_OR_CERTIFICATION_CLAIM'
      });
      break;
    }
  }

  const blocked = findings.some((finding) =>
    finding.severity === 'block' || finding.severity === 'error'
  );

  return {
    allowed: !blocked,
    blocked,
    requiresHumanReview: findings.some((finding) =>
      finding.severity === 'review'
    ),
    findings,
    outputStored: false
  };
}

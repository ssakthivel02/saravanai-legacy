import { cleanText, sha256 } from './shared.js';

const CONTENT_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'application/json',
  'application/pdf',
  'text/html'
]);

const MALICIOUS_MARKERS = [
  /ignore (?:all|the) previous instructions/i,
  /reveal (?:the )?system prompt/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\b(?:api[_ -]?key|access[_ -]?token|password)\b\s*[:=]/i
];

export async function quarantinePreview(input = {}) {
  const sourceId = cleanText(input.sourceId, 100).toLowerCase();
  const contentType = cleanText(input.contentType, 100).toLowerCase();
  const filename = cleanText(input.filename, 255);
  const content = typeof input.content === 'string'
    ? input.content.slice(0, 20000)
    : '';
  const findings = [];

  if (!sourceId) findings.push('source_id_required');
  if (!CONTENT_TYPES.has(contentType)) findings.push('content_type_not_allowlisted');
  if (!filename) findings.push('filename_required');
  if (!content) findings.push('content_required');
  if (typeof input.content === 'string' && input.content.length > 20000) {
    findings.push('preview_content_too_large');
  }
  if (MALICIOUS_MARKERS.some((pattern) => pattern.test(content))) {
    findings.push('prompt_injection_or_secret_marker_detected');
  }

  return {
    acceptedForPreview: findings.length === 0,
    quarantineRequired: true,
    findings,
    metadata: {
      sourceId,
      filename,
      contentType,
      contentLength: content.length,
      contentSha256: content ? await sha256(content) : null,
      contentStored: false,
      malwareScanPerformed: false,
      externalParserInvoked: false
    }
  };
}

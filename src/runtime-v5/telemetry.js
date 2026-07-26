import { clean, sha256 } from './core.js';
const SECRET_PATTERNS = [/(bearer\s+)[a-z0-9._-]+/ig, /(api[_-]?key\s*[=:]\s*)\S+/ig, /(password\s*[=:]\s*)\S+/ig];
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig;

export async function sanitizeTelemetry(input = {}) {
  const eventType = clean(input.eventType, 100).toLowerCase();
  const service = clean(input.service, 100);
  const message = clean(input.message, 2000);
  const findings = [];
  if (!eventType) findings.push('event_type_required');
  if (!service) findings.push('service_required');
  let sanitized = message;
  for (const pattern of SECRET_PATTERNS) sanitized = sanitized.replace(pattern, '$1[REDACTED]');
  sanitized = sanitized.replace(EMAIL_PATTERN, '[EMAIL_REDACTED]');
  return {
    valid: findings.length === 0,
    findings,
    telemetry: {
      eventType,
      service,
      message: sanitized,
      originalMessageFingerprint: message ? (await sha256(message)).slice(0, 20) : null,
      rawContentPersisted: false,
      exported: false
    }
  };
}

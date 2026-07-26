import { sha256, text } from './shared.js';

const KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{15,127}$/;

export async function inspectIdempotency(input = {}) {
  const key = text(input.idempotencyKey, 128);
  const payload = typeof input.payload === 'undefined' ? '' : JSON.stringify(input.payload);
  const findings = [];

  if (!KEY_PATTERN.test(key)) findings.push('idempotency_key_invalid');
  if (!payload) findings.push('payload_required');

  return {
    valid: findings.length === 0,
    keyAccepted: findings.length === 0,
    keyFingerprint: key ? (await sha256(key)).slice(0, 16) : null,
    payloadSha256: payload ? await sha256(payload) : null,
    findings,
    persisted: false,
    replayDecisionMade: false,
    note: 'Wave 2 validates the idempotency contract but does not persist keys.'
  };
}

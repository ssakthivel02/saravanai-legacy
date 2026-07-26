import { clean, sha256 } from './core.js';

export async function buildSreEvidencePacket(input = {}) {
  const releaseId = clean(input.releaseId, 120);
  const decision = clean(input.decision, 80).toLowerCase();
  const rationale = clean(input.rationale, 1000);
  const checks = Array.isArray(input.checks) ? input.checks.slice(0, 50).map((v) => clean(v, 160)).filter(Boolean) : [];
  const findings = [];
  if (!releaseId) findings.push('release_id_required');
  if (!['approve-review', 'block', 'observe'].includes(decision)) findings.push('decision_not_allowlisted');
  if (!rationale) findings.push('rationale_required');
  return {
    valid: findings.length === 0,
    findings,
    packet: {
      packetId: crypto.randomUUID(),
      releaseId,
      decision,
      rationaleFingerprint: rationale ? (await sha256(rationale)).slice(0, 24) : null,
      checks,
      contentStored: false,
      signedClaim: false,
      persisted: false
    }
  };
}

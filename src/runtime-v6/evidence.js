import { canonicalJson, clean, sha256 } from './core.js';

export async function buildSupplyChainEvidence(input = {}) {
  const releaseId = clean(input.releaseId, 120);
  const controls = Array.isArray(input.controls) ? input.controls.slice(0, 100) : [];
  const findings = [];
  if (!releaseId) findings.push('release_id_required');
  if (!controls.length) findings.push('control_evidence_required');

  const normalized = controls.map((control, index) => {
    const id = clean(control?.id, 120);
    const result = clean(control?.result, 30).toLowerCase();
    if (!id) findings.push(`control_${index}_id_required`);
    if (!['pass', 'fail', 'review'].includes(result)) findings.push(`control_${index}_result_invalid`);
    return { id, result };
  });
  const payload = { releaseId, controls: normalized };

  return {
    valid: findings.length === 0,
    findings,
    packet: {
      packetId: crypto.randomUUID(),
      payload,
      payloadSha256: await sha256(canonicalJson(payload)),
      signed: false,
      published: false,
      persisted: false,
      certificationClaim: false
    }
  };
}

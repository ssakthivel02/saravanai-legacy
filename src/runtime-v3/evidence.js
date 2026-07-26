import { cleanText, sha256 } from './shared.js';

export async function buildEvidencePacket(input = {}) {
  const title = cleanText(input.title, 300);
  const claimIds = Array.isArray(input.claimIds)
    ? input.claimIds.slice(0, 50).map((value) => cleanText(value, 120))
    : [];
  const sourceIds = Array.isArray(input.sourceIds)
    ? input.sourceIds.slice(0, 50).map((value) => cleanText(value, 100).toLowerCase())
    : [];
  const findings = [];

  if (!title) findings.push('title_required');
  if (!claimIds.length) findings.push('claim_id_required');
  if (!sourceIds.length) findings.push('source_id_required');

  const canonical = JSON.stringify({
    title,
    claimIds: [...new Set(claimIds)],
    sourceIds: [...new Set(sourceIds)]
  });

  return {
    valid: findings.length === 0,
    findings,
    packet: {
      packetId: crypto.randomUUID(),
      title,
      claimIds: [...new Set(claimIds)],
      sourceIds: [...new Set(sourceIds)],
      metadataSha256: await sha256(canonical),
      evidenceContentStored: false,
      exportGenerated: false,
      certificationClaim: false,
      humanReviewRequired: true
    }
  };
}

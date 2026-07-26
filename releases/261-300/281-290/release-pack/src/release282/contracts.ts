export interface EvidenceCollectionJob {
  jobId: string;
  tenantId: string;
  controlIds: string[];
  sourceConnectorIds: string[];
  minimumDataRequired: true;
  sha256: string;
  expiresAt: string;
  status: 'planned' | 'running' | 'completed' | 'failed';
}

export const RELEASE_282_CONTROLS = ["controls_required", "sources_authorised", "data_minimisation_required", "integrity_hash_required"] as const;

export function validateEvidenceCollectionJob(value: EvidenceCollectionJob): string[] {
  const errors: string[] = [];
  if (!value.jobId.trim()) errors.push("jobId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.controlIds.length) errors.push("controlIds_required");
  if (!value.sourceConnectorIds.length) errors.push("sourceConnectorIds_required");
  if (value.minimumDataRequired !== true) errors.push("minimumDataRequired_must_remain_true");
  if (!value.sha256.trim()) errors.push("sha256_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (!/^[a-f0-9]{64}$/i.test(value.sha256)) errors.push("sha256_invalid");
  return [...new Set(errors)];
}

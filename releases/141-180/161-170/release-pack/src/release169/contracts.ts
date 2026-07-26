export interface PlatformSlo {
  sloId: string;
  service: string;
  target: number;
  windowDays: number;
  owner: string;
  recoveryEvidenceRefs: string[];
}

export const RELEASE_169_CONTROLS = ["target_in_range", "owner_required", "recovery_evidence_required"] as const;

export function validatePlatformSlo(value: PlatformSlo): string[] {
  const errors: string[] = [];
  if (!value.sloId.trim()) errors.push("sloId_required");
  if (!value.service.trim()) errors.push("service_required");
  if (!Number.isFinite(value.target) || value.target < 0) errors.push("target_invalid");
  if (!Number.isFinite(value.windowDays) || value.windowDays < 0) errors.push("windowDays_invalid");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.recoveryEvidenceRefs.length) errors.push("recoveryEvidenceRefs_required");
  if (value.target <= 0 || value.target > 1) errors.push("target_out_of_range");
  return [...new Set(errors)];
}

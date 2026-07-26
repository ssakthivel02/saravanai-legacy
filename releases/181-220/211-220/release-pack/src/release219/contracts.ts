export interface PreservationPackage {
  packageId: string;
  recordTypes: string[];
  formats: string[];
  sha256: string;
  retentionPolicyId: string;
  accessPolicyId: string;
  disposition: 'preserve' | 'review' | 'delete';
  owner: string;
}

export const RELEASE_219_CONTROLS = ["open_formats_required", "integrity_hash_required", "retention_required", "owner_required"] as const;

export function validatePreservationPackage(value: PreservationPackage): string[] {
  const errors: string[] = [];
  if (!value.packageId.trim()) errors.push("packageId_required");
  if (!value.recordTypes.length) errors.push("recordTypes_required");
  if (!value.formats.length) errors.push("formats_required");
  if (!value.sha256.trim()) errors.push("sha256_required");
  if (!value.retentionPolicyId.trim()) errors.push("retentionPolicyId_required");
  if (!value.accessPolicyId.trim()) errors.push("accessPolicyId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!/^[a-f0-9]{64}$/i.test(value.sha256)) errors.push("sha256_invalid");
  return [...new Set(errors)];
}

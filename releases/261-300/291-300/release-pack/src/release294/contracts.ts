export interface PortabilityPackage {
  packageId: string;
  tenantId: string;
  formatIds: string[];
  schemaVersion: string;
  sha256: string;
  exportedAt: string;
  expiresAt: string;
  status: 'created' | 'downloaded' | 'expired' | 'revoked';
}

export const RELEASE_294_CONTROLS = ["open_formats_required", "schema_version_required", "integrity_hash_required", "expiry_required"] as const;

export function validatePortabilityPackage(value: PortabilityPackage): string[] {
  const errors: string[] = [];
  if (!value.packageId.trim()) errors.push("packageId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.formatIds.length) errors.push("formatIds_required");
  if (!value.schemaVersion.trim()) errors.push("schemaVersion_required");
  if (!value.sha256.trim()) errors.push("sha256_required");
  if (!value.exportedAt.trim()) errors.push("exportedAt_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (!/^[a-f0-9]{64}$/i.test(value.sha256)) errors.push("sha256_invalid");
  return [...new Set(errors)];
}

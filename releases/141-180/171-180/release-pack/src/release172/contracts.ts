export interface ExportJob {
  exportId: string;
  tenantId: string;
  formats: string[];
  sha256: string;
  expiresAt: string;
  requestedBy: string;
  approvedBy: string | undefined;
}

export const RELEASE_172_CONTROLS = ["open_format_required", "integrity_hash_required", "approval_for_restricted_export"] as const;

export function validateExportJob(value: ExportJob): string[] {
  const errors: string[] = [];
  if (!value.exportId.trim()) errors.push("exportId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.formats.length) errors.push("formats_required");
  if (!value.sha256.trim()) errors.push("sha256_required");
  if (!value.expiresAt.trim()) errors.push("expiresAt_required");
  if (!value.requestedBy.trim()) errors.push("requestedBy_required");
  if (!/^[a-f0-9]{64}$/i.test(value.sha256)) errors.push("sha256_invalid");
  return [...new Set(errors)];
}

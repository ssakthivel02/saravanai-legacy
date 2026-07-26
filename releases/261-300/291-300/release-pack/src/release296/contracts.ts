export interface CustomerMigration {
  migrationId: string;
  tenantId: string;
  sourceVersion: string;
  targetVersion: string;
  rehearsalEvidenceRefs: string[];
  compatibilityEvidenceRefs: string[];
  rollbackRef: string;
  status: 'planned' | 'rehearsed' | 'cutover' | 'completed' | 'rolled_back';
}

export const RELEASE_296_CONTROLS = ["source_target_required", "rehearsal_required", "compatibility_required", "rollback_required"] as const;

export function validateCustomerMigration(value: CustomerMigration): string[] {
  const errors: string[] = [];
  if (!value.migrationId.trim()) errors.push("migrationId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.sourceVersion.trim()) errors.push("sourceVersion_required");
  if (!value.targetVersion.trim()) errors.push("targetVersion_required");
  if (!value.rehearsalEvidenceRefs.length) errors.push("rehearsalEvidenceRefs_required");
  if (!value.compatibilityEvidenceRefs.length) errors.push("compatibilityEvidenceRefs_required");
  if (!value.rollbackRef.trim()) errors.push("rollbackRef_required");
  return [...new Set(errors)];
}

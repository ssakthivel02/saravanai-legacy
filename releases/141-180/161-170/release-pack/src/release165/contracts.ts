export interface DatabaseChange {
  changeId: string;
  migrationRef: string;
  compatibility: 'backward_compatible' | 'breaking';
  backupEvidenceId: string;
  rehearsalEvidenceId: string;
  rollbackRef: string;
}

export const RELEASE_165_CONTROLS = ["backup_required", "rehearsal_required", "rollback_required"] as const;

export function validateDatabaseChange(value: DatabaseChange): string[] {
  const errors: string[] = [];
  if (!value.changeId.trim()) errors.push("changeId_required");
  if (!value.migrationRef.trim()) errors.push("migrationRef_required");
  if (!value.backupEvidenceId.trim()) errors.push("backupEvidenceId_required");
  if (!value.rehearsalEvidenceId.trim()) errors.push("rehearsalEvidenceId_required");
  if (!value.rollbackRef.trim()) errors.push("rollbackRef_required");
  return [...new Set(errors)];
}

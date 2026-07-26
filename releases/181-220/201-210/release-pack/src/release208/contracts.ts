export interface CyberRecoveryExercise {
  exerciseId: string;
  service: string;
  backupRef: string;
  restoreEnvironment: string;
  rtoMinutes: number;
  rpoMinutes: number;
  evidenceRefs: string[];
  outcome: 'planned' | 'passed' | 'partial' | 'failed';
}

export const RELEASE_208_CONTROLS = ["backup_required", "isolated_restore_required", "objectives_recorded", "evidence_required"] as const;

export function validateCyberRecoveryExercise(value: CyberRecoveryExercise): string[] {
  const errors: string[] = [];
  if (!value.exerciseId.trim()) errors.push("exerciseId_required");
  if (!value.service.trim()) errors.push("service_required");
  if (!value.backupRef.trim()) errors.push("backupRef_required");
  if (!value.restoreEnvironment.trim()) errors.push("restoreEnvironment_required");
  if (!Number.isFinite(value.rtoMinutes) || value.rtoMinutes < 0) errors.push("rtoMinutes_invalid");
  if (!Number.isFinite(value.rpoMinutes) || value.rpoMinutes < 0) errors.push("rpoMinutes_invalid");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  return [...new Set(errors)];
}

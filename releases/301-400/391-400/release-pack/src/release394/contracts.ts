export interface DataAndPlatformExitProgramme {
  planId: string;
  tenantId: string;
  owner: string;
  objective: string;
  dependencyRefs: string[];
  milestoneIds: string[];
  evidenceRefs: string[];
  rollbackOrExitRef: string;
  approvedBy: string | undefined;
  status: 'draft' | 'approved' | 'active' | 'completed' | 'retired';
}

export const RELEASE_394_CONTROLS = ["owner_accountability_required", "evidence_integrity_required", "dependencies_required", "milestones_required", "rollback_or_exit_required", "portability_and_revocation_required"] as const;

export function validateDataAndPlatformExitProgramme(value: DataAndPlatformExitProgramme): string[] {
  const errors: string[] = [];
  if (!value.planId.trim()) errors.push("planId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.objective.trim()) errors.push("objective_required");
  if (!value.dependencyRefs.length) errors.push("dependencyRefs_required");
  if (!value.milestoneIds.length) errors.push("milestoneIds_required");
  if (!value.evidenceRefs.length) errors.push("evidenceRefs_required");
  if (!value.rollbackOrExitRef.trim()) errors.push("rollbackOrExitRef_required");
  return [...new Set(errors)];
}

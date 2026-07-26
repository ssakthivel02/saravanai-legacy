export interface ReleaseTrain {
  trainId: string;
  owner: string;
  releaseIds: string[];
  dependencyRefs: string[];
  milestoneIds: string[];
  gateIds: string[];
  changeWindowId: string;
  status: 'planned' | 'executing' | 'paused' | 'completed';
}

export const RELEASE_295_CONTROLS = ["owner_required", "releases_required", "dependencies_mapped", "gates_required"] as const;

export function validateReleaseTrain(value: ReleaseTrain): string[] {
  const errors: string[] = [];
  if (!value.trainId.trim()) errors.push("trainId_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.releaseIds.length) errors.push("releaseIds_required");
  if (!value.dependencyRefs.length) errors.push("dependencyRefs_required");
  if (!value.milestoneIds.length) errors.push("milestoneIds_required");
  if (!value.gateIds.length) errors.push("gateIds_required");
  if (!value.changeWindowId.trim()) errors.push("changeWindowId_required");
  return [...new Set(errors)];
}

export interface WorkforceCapability {
  capabilityId: string;
  role: string;
  requiredSkills: string[];
  learningPathIds: string[];
  successionRisk: 'low' | 'medium' | 'high';
  owner: string;
  invasiveMonitoringAllowed: false;
}

export const RELEASE_216_CONTROLS = ["skills_required", "learning_paths_required", "owner_required", "invasive_monitoring_forbidden"] as const;

export function validateWorkforceCapability(value: WorkforceCapability): string[] {
  const errors: string[] = [];
  if (!value.capabilityId.trim()) errors.push("capabilityId_required");
  if (!value.role.trim()) errors.push("role_required");
  if (!value.requiredSkills.length) errors.push("requiredSkills_required");
  if (!value.learningPathIds.length) errors.push("learningPathIds_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (value.invasiveMonitoringAllowed !== false) errors.push("invasiveMonitoringAllowed_must_remain_false");
  return [...new Set(errors)];
}

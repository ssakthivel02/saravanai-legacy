export interface StrategicObjective {
  objectiveId: string;
  name: string;
  owner: string;
  outcomeMeasures: string[];
  initiativeIds: string[];
  dependencyRefs: string[];
  riskRefs: string[];
  status: 'planned' | 'active' | 'achieved' | 'retired';
}

export const RELEASE_211_CONTROLS = ["owner_required", "outcomes_measurable", "dependencies_recorded", "risks_linked"] as const;

export function validateStrategicObjective(value: StrategicObjective): string[] {
  const errors: string[] = [];
  if (!value.objectiveId.trim()) errors.push("objectiveId_required");
  if (!value.name.trim()) errors.push("name_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.outcomeMeasures.length) errors.push("outcomeMeasures_required");
  if (!value.initiativeIds.length) errors.push("initiativeIds_required");
  if (!value.dependencyRefs.length) errors.push("dependencyRefs_required");
  if (!value.riskRefs.length) errors.push("riskRefs_required");
  return [...new Set(errors)];
}

export interface ProcessDefinition {
  processId: string;
  tenantId: string;
  name: string;
  owner: string;
  criticality: 'critical' | 'important' | 'standard';
  dependencyIds: string[];
  dataClassifications: string[];
  status: 'draft' | 'active' | 'retired';
}

export const RELEASE_261_CONTROLS = ["owner_required", "criticality_declared", "dependencies_mapped", "data_classification_required"] as const;

export function validateProcessDefinition(value: ProcessDefinition): string[] {
  const errors: string[] = [];
  if (!value.processId.trim()) errors.push("processId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.name.trim()) errors.push("name_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.dependencyIds.length) errors.push("dependencyIds_required");
  if (!value.dataClassifications.length) errors.push("dataClassifications_required");
  return [...new Set(errors)];
}

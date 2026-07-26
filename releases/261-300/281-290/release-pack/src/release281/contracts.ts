export interface ControlDefinition {
  controlId: string;
  title: string;
  owner: string;
  objective: string;
  testProcedureIds: string[];
  evidenceTypeIds: string[];
  frameworkMappings: string[];
  status: 'draft' | 'approved' | 'retired';
}

export const RELEASE_281_CONTROLS = ["owner_required", "objective_required", "test_procedures_required", "evidence_types_required"] as const;

export function validateControlDefinition(value: ControlDefinition): string[] {
  const errors: string[] = [];
  if (!value.controlId.trim()) errors.push("controlId_required");
  if (!value.title.trim()) errors.push("title_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (!value.objective.trim()) errors.push("objective_required");
  if (!value.testProcedureIds.length) errors.push("testProcedureIds_required");
  if (!value.evidenceTypeIds.length) errors.push("evidenceTypeIds_required");
  if (!value.frameworkMappings.length) errors.push("frameworkMappings_required");
  return [...new Set(errors)];
}

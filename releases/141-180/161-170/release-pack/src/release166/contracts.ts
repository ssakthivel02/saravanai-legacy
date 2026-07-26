export interface DataPipeline {
  pipelineId: string;
  tenantId: string;
  inputContracts: string[];
  outputContracts: string[];
  qualityRules: string[];
  quarantineEnabled: boolean;
}

export const RELEASE_166_CONTROLS = ["contracts_required", "quality_rules_required", "tenant_boundary_required"] as const;

export function validateDataPipeline(value: DataPipeline): string[] {
  const errors: string[] = [];
  if (!value.pipelineId.trim()) errors.push("pipelineId_required");
  if (!value.tenantId.trim()) errors.push("tenantId_required");
  if (!value.inputContracts.length) errors.push("inputContracts_required");
  if (!value.outputContracts.length) errors.push("outputContracts_required");
  if (!value.qualityRules.length) errors.push("qualityRules_required");
  return [...new Set(errors)];
}

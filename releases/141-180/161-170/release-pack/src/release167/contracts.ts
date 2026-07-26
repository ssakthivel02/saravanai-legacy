export interface ModelPipeline {
  pipelineId: string;
  datasetRefs: string[];
  modelVersion: string;
  evaluationSuiteIds: string[];
  reproducibilityEvidenceId: string;
  promotionAllowed: boolean;
}

export const RELEASE_167_CONTROLS = ["dataset_provenance_required", "evaluation_required", "reproducibility_required"] as const;

export function validateModelPipeline(value: ModelPipeline): string[] {
  const errors: string[] = [];
  if (!value.pipelineId.trim()) errors.push("pipelineId_required");
  if (!value.datasetRefs.length) errors.push("datasetRefs_required");
  if (!value.modelVersion.trim()) errors.push("modelVersion_required");
  if (!value.evaluationSuiteIds.length) errors.push("evaluationSuiteIds_required");
  if (!value.reproducibilityEvidenceId.trim()) errors.push("reproducibilityEvidenceId_required");
  return [...new Set(errors)];
}

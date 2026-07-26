export interface BenchmarkResult {
  resultId: string;
  modelVersion: string;
  suiteId: string;
  datasetRefs: string[];
  scores: Record<string, number>;
  safetyFailures: number;
  regressions: string[];
  promotionAllowed: boolean;
}

export const RELEASE_183_CONTROLS = ["dataset_provenance_required", "safety_failures_block", "regressions_block", "promotion_requires_review"] as const;

export function validateBenchmarkResult(value: BenchmarkResult): string[] {
  const errors: string[] = [];
  if (!value.resultId.trim()) errors.push("resultId_required");
  if (!value.modelVersion.trim()) errors.push("modelVersion_required");
  if (!value.suiteId.trim()) errors.push("suiteId_required");
  if (!value.datasetRefs.length) errors.push("datasetRefs_required");
  if (!Number.isFinite(value.safetyFailures) || value.safetyFailures < 0) errors.push("safetyFailures_invalid");
  if (!value.regressions.length) errors.push("regressions_required");
  return [...new Set(errors)];
}

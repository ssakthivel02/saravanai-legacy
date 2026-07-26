export interface DataQualityResult {
  resultId: string;
  assetId: string;
  ruleId: string;
  score: number;
  failedRows: number;
  observedAt: string;
  owner: string;
  status: 'pass' | 'warn' | 'fail';
}

export const RELEASE_195_CONTROLS = ["score_bounded", "observation_time_required", "owner_required", "failure_requires_action"] as const;

export function validateDataQualityResult(value: DataQualityResult): string[] {
  const errors: string[] = [];
  if (!value.resultId.trim()) errors.push("resultId_required");
  if (!value.assetId.trim()) errors.push("assetId_required");
  if (!value.ruleId.trim()) errors.push("ruleId_required");
  if (!Number.isFinite(value.score) || value.score < 0) errors.push("score_invalid");
  if (!Number.isFinite(value.failedRows) || value.failedRows < 0) errors.push("failedRows_invalid");
  if (!value.observedAt.trim()) errors.push("observedAt_required");
  if (!value.owner.trim()) errors.push("owner_required");
  if (value.score < 0 || value.score > 1) errors.push("score_out_of_range");
  return [...new Set(errors)];
}

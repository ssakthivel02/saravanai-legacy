import type { DataQualityResult } from "./contracts";

export interface Release195Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateDataQualityResult(value: DataQualityResult): Release195Decision {
  if (value.failedRows > 0 && value.status === "pass") return { allowed: false, reason: "inconsistent_quality_result", obligations: ["correct_result"] };
  return { allowed: true, reason: "release_195_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}

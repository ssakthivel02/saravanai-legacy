import type { BenchmarkResult } from "./contracts";

export interface Release183Decision {
  allowed: boolean;
  reason: string;
  obligations: string[];
}

export function evaluateBenchmarkResult(value: BenchmarkResult): Release183Decision {
  if (value.safetyFailures > 0) return { allowed: false, reason: "safety_failures_block", obligations: ["block_promotion"] };
  if (value.regressions.length) return { allowed: false, reason: "regressions_block", obligations: ["re_evaluate"] };
  if (value.promotionAllowed) return { allowed: true, reason: "promotion_candidate", obligations: ["independent_approval", "retain_evaluation"] };
  return { allowed: true, reason: "release_183_policy_satisfied", obligations: ["audit_decision", "retain_evidence"] };
}

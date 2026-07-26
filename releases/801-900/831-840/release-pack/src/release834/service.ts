import type { HybridRetrievalRankingAndFreshnessPolicy } from "./contracts";
import { validateHybridRetrievalRankingAndFreshnessPolicy } from "./contracts";
import { evaluateHybridRetrievalRankingAndFreshnessPolicy } from "./policy";

export function assessRelease834(value: HybridRetrievalRankingAndFreshnessPolicy) {
  const validationErrors = validateHybridRetrievalRankingAndFreshnessPolicy(value);
  if (validationErrors.length) {
    return {
      valid: false,
      validationErrors,
      decision: { allowed: false, reason: "validation_failed", obligations: ["correct_input"] }
    };
  }
  return {
    valid: true,
    validationErrors: [],
    decision: evaluateHybridRetrievalRankingAndFreshnessPolicy(value)
  };
}

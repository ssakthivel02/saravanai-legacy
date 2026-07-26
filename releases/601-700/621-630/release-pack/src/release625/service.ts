import type { HybridSearchAndRankingEvaluation } from "./contracts";
import { validateHybridSearchAndRankingEvaluation } from "./contracts";
import { evaluateHybridSearchAndRankingEvaluation } from "./policy";

export function assessRelease625(value: HybridSearchAndRankingEvaluation) {
  const validationErrors = validateHybridSearchAndRankingEvaluation(value);
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
    decision: evaluateHybridSearchAndRankingEvaluation(value)
  };
}

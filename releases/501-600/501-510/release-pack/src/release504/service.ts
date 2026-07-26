import type { MultiCriteriaDecisionAnalysis } from "./contracts";
import { validateMultiCriteriaDecisionAnalysis } from "./contracts";
import { evaluateMultiCriteriaDecisionAnalysis } from "./policy";

export function assessRelease504(value: MultiCriteriaDecisionAnalysis) {
  const validationErrors = validateMultiCriteriaDecisionAnalysis(value);
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
    decision: evaluateMultiCriteriaDecisionAnalysis(value)
  };
}

import type { DecisionAppealAndReconsideration } from "./contracts";
import { validateDecisionAppealAndReconsideration } from "./contracts";
import { evaluateDecisionAppealAndReconsideration } from "./policy";

export function assessRelease509(value: DecisionAppealAndReconsideration) {
  const validationErrors = validateDecisionAppealAndReconsideration(value);
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
    decision: evaluateDecisionAppealAndReconsideration(value)
  };
}

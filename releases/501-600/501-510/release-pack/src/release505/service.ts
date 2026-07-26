import type { DecisionExplanationAndTraceability } from "./contracts";
import { validateDecisionExplanationAndTraceability } from "./contracts";
import { evaluateDecisionExplanationAndTraceability } from "./policy";

export function assessRelease505(value: DecisionExplanationAndTraceability) {
  const validationErrors = validateDecisionExplanationAndTraceability(value);
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
    decision: evaluateDecisionExplanationAndTraceability(value)
  };
}

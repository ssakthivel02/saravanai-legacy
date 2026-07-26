import type { DecisionIntelligenceAssuranceGate } from "./contracts";
import { validateDecisionIntelligenceAssuranceGate } from "./contracts";
import { evaluateDecisionIntelligenceAssuranceGate } from "./policy";

export function assessRelease510(value: DecisionIntelligenceAssuranceGate) {
  const validationErrors = validateDecisionIntelligenceAssuranceGate(value);
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
    decision: evaluateDecisionIntelligenceAssuranceGate(value)
  };
}

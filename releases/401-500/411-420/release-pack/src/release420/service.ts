import type { SovereignAndEdgeAIAssuranceGate } from "./contracts";
import { validateSovereignAndEdgeAIAssuranceGate } from "./contracts";
import { evaluateSovereignAndEdgeAIAssuranceGate } from "./policy";

export function assessRelease420(value: SovereignAndEdgeAIAssuranceGate) {
  const validationErrors = validateSovereignAndEdgeAIAssuranceGate(value);
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
    decision: evaluateSovereignAndEdgeAIAssuranceGate(value)
  };
}

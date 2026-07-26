import type { ObservabilityAndSREAssuranceGate } from "./contracts";
import { validateObservabilityAndSREAssuranceGate } from "./contracts";
import { evaluateObservabilityAndSREAssuranceGate } from "./policy";

export function assessRelease670(value: ObservabilityAndSREAssuranceGate) {
  const validationErrors = validateObservabilityAndSREAssuranceGate(value);
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
    decision: evaluateObservabilityAndSREAssuranceGate(value)
  };
}

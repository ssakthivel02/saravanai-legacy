import type { AIRuntimeControlPlaneAssuranceGate } from "./contracts";
import { validateAIRuntimeControlPlaneAssuranceGate } from "./contracts";
import { evaluateAIRuntimeControlPlaneAssuranceGate } from "./policy";

export function assessRelease610(value: AIRuntimeControlPlaneAssuranceGate) {
  const validationErrors = validateAIRuntimeControlPlaneAssuranceGate(value);
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
    decision: evaluateAIRuntimeControlPlaneAssuranceGate(value)
  };
}

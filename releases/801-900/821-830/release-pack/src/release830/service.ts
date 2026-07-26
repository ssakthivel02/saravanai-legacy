import type { BoundedAgentRuntimeActivationGate } from "./contracts";
import { validateBoundedAgentRuntimeActivationGate } from "./contracts";
import { evaluateBoundedAgentRuntimeActivationGate } from "./policy";

export function assessRelease830(value: BoundedAgentRuntimeActivationGate) {
  const validationErrors = validateBoundedAgentRuntimeActivationGate(value);
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
    decision: evaluateBoundedAgentRuntimeActivationGate(value)
  };
}

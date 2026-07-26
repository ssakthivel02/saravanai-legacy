import type { ResilienceFailureAndRecoverySimulation } from "./contracts";
import { validateResilienceFailureAndRecoverySimulation } from "./contracts";
import { evaluateResilienceFailureAndRecoverySimulation } from "./policy";

export function assessRelease877(value: ResilienceFailureAndRecoverySimulation) {
  const validationErrors = validateResilienceFailureAndRecoverySimulation(value);
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
    decision: evaluateResilienceFailureAndRecoverySimulation(value)
  };
}

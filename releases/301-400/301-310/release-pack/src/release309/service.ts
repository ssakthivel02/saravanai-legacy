import type { RecoveryAndContinuitySimulation } from "./contracts";
import { validateRecoveryAndContinuitySimulation } from "./contracts";
import { evaluateRecoveryAndContinuitySimulation } from "./policy";

export function assessRelease309(value: RecoveryAndContinuitySimulation) {
  const validationErrors = validateRecoveryAndContinuitySimulation(value);
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
    decision: evaluateRecoveryAndContinuitySimulation(value)
  };
}

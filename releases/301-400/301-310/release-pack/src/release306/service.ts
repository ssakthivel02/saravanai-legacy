import type { ThreatAndAttackSimulation } from "./contracts";
import { validateThreatAndAttackSimulation } from "./contracts";
import { evaluateThreatAndAttackSimulation } from "./policy";

export function assessRelease306(value: ThreatAndAttackSimulation) {
  const validationErrors = validateThreatAndAttackSimulation(value);
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
    decision: evaluateThreatAndAttackSimulation(value)
  };
}

import type { ChangeImpactSimulation } from "./contracts";
import { validateChangeImpactSimulation } from "./contracts";
import { evaluateChangeImpactSimulation } from "./policy";

export function assessRelease308(value: ChangeImpactSimulation) {
  const validationErrors = validateChangeImpactSimulation(value);
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
    decision: evaluateChangeImpactSimulation(value)
  };
}

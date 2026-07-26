import type { EnergyEfficiencyEngineering } from "./contracts";
import { validateEnergyEfficiencyEngineering } from "./contracts";
import { evaluateEnergyEfficiencyEngineering } from "./policy";

export function assessRelease463(value: EnergyEfficiencyEngineering) {
  const validationErrors = validateEnergyEfficiencyEngineering(value);
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
    decision: evaluateEnergyEfficiencyEngineering(value)
  };
}

import type { EnergyAndUtilitiesOTSafetyPattern } from "./contracts";
import { validateEnergyAndUtilitiesOTSafetyPattern } from "./contracts";
import { evaluateEnergyAndUtilitiesOTSafetyPattern } from "./policy";

export function assessRelease361(value: EnergyAndUtilitiesOTSafetyPattern) {
  const validationErrors = validateEnergyAndUtilitiesOTSafetyPattern(value);
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
    decision: evaluateEnergyAndUtilitiesOTSafetyPattern(value)
  };
}

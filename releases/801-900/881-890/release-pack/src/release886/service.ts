import type { EnergyCarbonAndSustainabilityMeasurement } from "./contracts";
import { validateEnergyCarbonAndSustainabilityMeasurement } from "./contracts";
import { evaluateEnergyCarbonAndSustainabilityMeasurement } from "./policy";

export function assessRelease886(value: EnergyCarbonAndSustainabilityMeasurement) {
  const validationErrors = validateEnergyCarbonAndSustainabilityMeasurement(value);
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
    decision: evaluateEnergyCarbonAndSustainabilityMeasurement(value)
  };
}

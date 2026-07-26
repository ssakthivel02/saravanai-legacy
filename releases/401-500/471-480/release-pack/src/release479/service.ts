import type { EngineeringProductivityAndFairMeasurement } from "./contracts";
import { validateEngineeringProductivityAndFairMeasurement } from "./contracts";
import { evaluateEngineeringProductivityAndFairMeasurement } from "./policy";

export function assessRelease479(value: EngineeringProductivityAndFairMeasurement) {
  const validationErrors = validateEngineeringProductivityAndFairMeasurement(value);
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
    decision: evaluateEngineeringProductivityAndFairMeasurement(value)
  };
}

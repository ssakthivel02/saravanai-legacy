import type { SustainabilityDataAndMethodologyRegistry } from "./contracts";
import { validateSustainabilityDataAndMethodologyRegistry } from "./contracts";
import { evaluateSustainabilityDataAndMethodologyRegistry } from "./policy";

export function assessRelease461(value: SustainabilityDataAndMethodologyRegistry) {
  const validationErrors = validateSustainabilityDataAndMethodologyRegistry(value);
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
    decision: evaluateSustainabilityDataAndMethodologyRegistry(value)
  };
}

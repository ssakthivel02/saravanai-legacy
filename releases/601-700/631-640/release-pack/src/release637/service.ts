import type { SensitiveDataDiscoveryAndClassification } from "./contracts";
import { validateSensitiveDataDiscoveryAndClassification } from "./contracts";
import { evaluateSensitiveDataDiscoveryAndClassification } from "./policy";

export function assessRelease637(value: SensitiveDataDiscoveryAndClassification) {
  const validationErrors = validateSensitiveDataDiscoveryAndClassification(value);
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
    decision: evaluateSensitiveDataDiscoveryAndClassification(value)
  };
}

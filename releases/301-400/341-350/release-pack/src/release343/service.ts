import type { PrivacyEnhancingTechnologyCatalogue } from "./contracts";
import { validatePrivacyEnhancingTechnologyCatalogue } from "./contracts";
import { evaluatePrivacyEnhancingTechnologyCatalogue } from "./policy";

export function assessRelease343(value: PrivacyEnhancingTechnologyCatalogue) {
  const validationErrors = validatePrivacyEnhancingTechnologyCatalogue(value);
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
    decision: evaluatePrivacyEnhancingTechnologyCatalogue(value)
  };
}

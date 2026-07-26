import type { BusinessTransformationBenefitsTracking } from "./contracts";
import { validateBusinessTransformationBenefitsTracking } from "./contracts";
import { evaluateBusinessTransformationBenefitsTracking } from "./policy";

export function assessRelease449(value: BusinessTransformationBenefitsTracking) {
  const validationErrors = validateBusinessTransformationBenefitsTracking(value);
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
    decision: evaluateBusinessTransformationBenefitsTracking(value)
  };
}

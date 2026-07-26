import type { BenefitsRealisationAndOutcomeVerification } from "./contracts";
import { validateBenefitsRealisationAndOutcomeVerification } from "./contracts";
import { evaluateBenefitsRealisationAndOutcomeVerification } from "./policy";

export function assessRelease575(value: BenefitsRealisationAndOutcomeVerification) {
  const validationErrors = validateBenefitsRealisationAndOutcomeVerification(value);
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
    decision: evaluateBenefitsRealisationAndOutcomeVerification(value)
  };
}

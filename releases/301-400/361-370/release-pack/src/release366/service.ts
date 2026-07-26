import type { LegalServicesConfidentialityPattern } from "./contracts";
import { validateLegalServicesConfidentialityPattern } from "./contracts";
import { evaluateLegalServicesConfidentialityPattern } from "./policy";

export function assessRelease366(value: LegalServicesConfidentialityPattern) {
  const validationErrors = validateLegalServicesConfidentialityPattern(value);
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
    decision: evaluateLegalServicesConfidentialityPattern(value)
  };
}

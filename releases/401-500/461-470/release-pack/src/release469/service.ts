import type { SustainabilityClaimsAndDisclosure } from "./contracts";
import { validateSustainabilityClaimsAndDisclosure } from "./contracts";
import { evaluateSustainabilityClaimsAndDisclosure } from "./policy";

export function assessRelease469(value: SustainabilityClaimsAndDisclosure) {
  const validationErrors = validateSustainabilityClaimsAndDisclosure(value);
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
    decision: evaluateSustainabilityClaimsAndDisclosure(value)
  };
}

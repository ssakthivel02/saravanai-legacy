import type { RegulatedIndustryAssuranceGate } from "./contracts";
import { validateRegulatedIndustryAssuranceGate } from "./contracts";
import { evaluateRegulatedIndustryAssuranceGate } from "./policy";

export function assessRelease370(value: RegulatedIndustryAssuranceGate) {
  const validationErrors = validateRegulatedIndustryAssuranceGate(value);
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
    decision: evaluateRegulatedIndustryAssuranceGate(value)
  };
}

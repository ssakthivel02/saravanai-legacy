import type { CustomerHealthAndAdoptionIntelligence } from "./contracts";
import { validateCustomerHealthAndAdoptionIntelligence } from "./contracts";
import { evaluateCustomerHealthAndAdoptionIntelligence } from "./policy";

export function assessRelease355(value: CustomerHealthAndAdoptionIntelligence) {
  const validationErrors = validateCustomerHealthAndAdoptionIntelligence(value);
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
    decision: evaluateCustomerHealthAndAdoptionIntelligence(value)
  };
}

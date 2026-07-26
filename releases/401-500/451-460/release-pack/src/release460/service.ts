import type { CustomerExperienceAssuranceGate } from "./contracts";
import { validateCustomerExperienceAssuranceGate } from "./contracts";
import { evaluateCustomerExperienceAssuranceGate } from "./policy";

export function assessRelease460(value: CustomerExperienceAssuranceGate) {
  const validationErrors = validateCustomerExperienceAssuranceGate(value);
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
    decision: evaluateCustomerExperienceAssuranceGate(value)
  };
}

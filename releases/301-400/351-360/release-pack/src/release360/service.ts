import type { CustomerAndPartnerAssuranceGate } from "./contracts";
import { validateCustomerAndPartnerAssuranceGate } from "./contracts";
import { evaluateCustomerAndPartnerAssuranceGate } from "./policy";

export function assessRelease360(value: CustomerAndPartnerAssuranceGate) {
  const validationErrors = validateCustomerAndPartnerAssuranceGate(value);
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
    decision: evaluateCustomerAndPartnerAssuranceGate(value)
  };
}

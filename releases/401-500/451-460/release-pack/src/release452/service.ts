import type { CustomerIdentityAndPreferenceCentre } from "./contracts";
import { validateCustomerIdentityAndPreferenceCentre } from "./contracts";
import { evaluateCustomerIdentityAndPreferenceCentre } from "./policy";

export function assessRelease452(value: CustomerIdentityAndPreferenceCentre) {
  const validationErrors = validateCustomerIdentityAndPreferenceCentre(value);
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
    decision: evaluateCustomerIdentityAndPreferenceCentre(value)
  };
}

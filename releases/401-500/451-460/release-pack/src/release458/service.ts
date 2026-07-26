import type { CustomerTrustTransparencyCentre } from "./contracts";
import { validateCustomerTrustTransparencyCentre } from "./contracts";
import { evaluateCustomerTrustTransparencyCentre } from "./policy";

export function assessRelease458(value: CustomerTrustTransparencyCentre) {
  const validationErrors = validateCustomerTrustTransparencyCentre(value);
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
    decision: evaluateCustomerTrustTransparencyCentre(value)
  };
}

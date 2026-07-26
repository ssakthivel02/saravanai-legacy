import type { CommercialAndEntitlementReadinessWithoutBilling } from "./contracts";
import { validateCommercialAndEntitlementReadinessWithoutBilling } from "./contracts";
import { evaluateCommercialAndEntitlementReadinessWithoutBilling } from "./policy";

export function assessRelease497(value: CommercialAndEntitlementReadinessWithoutBilling) {
  const validationErrors = validateCommercialAndEntitlementReadinessWithoutBilling(value);
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
    decision: evaluateCommercialAndEntitlementReadinessWithoutBilling(value)
  };
}

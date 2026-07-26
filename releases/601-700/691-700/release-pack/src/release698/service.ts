import type { CommercialEntitlementReadinessWithoutBillingV2 } from "./contracts";
import { validateCommercialEntitlementReadinessWithoutBillingV2 } from "./contracts";
import { evaluateCommercialEntitlementReadinessWithoutBillingV2 } from "./policy";

export function assessRelease698(value: CommercialEntitlementReadinessWithoutBillingV2) {
  const validationErrors = validateCommercialEntitlementReadinessWithoutBillingV2(value);
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
    decision: evaluateCommercialEntitlementReadinessWithoutBillingV2(value)
  };
}

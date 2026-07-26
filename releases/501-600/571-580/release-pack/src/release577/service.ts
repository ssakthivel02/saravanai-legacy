import type { ConsumptionQuotaAndEntitlementPlanning } from "./contracts";
import { validateConsumptionQuotaAndEntitlementPlanning } from "./contracts";
import { evaluateConsumptionQuotaAndEntitlementPlanning } from "./policy";

export function assessRelease577(value: ConsumptionQuotaAndEntitlementPlanning) {
  const validationErrors = validateConsumptionQuotaAndEntitlementPlanning(value);
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
    decision: evaluateConsumptionQuotaAndEntitlementPlanning(value)
  };
}

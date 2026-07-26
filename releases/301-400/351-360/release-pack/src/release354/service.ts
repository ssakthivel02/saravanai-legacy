import type { CapabilitySubscriptionAndEntitlementReadiness } from "./contracts";
import { validateCapabilitySubscriptionAndEntitlementReadiness } from "./contracts";
import { evaluateCapabilitySubscriptionAndEntitlementReadiness } from "./policy";

export function assessRelease354(value: CapabilitySubscriptionAndEntitlementReadiness) {
  const validationErrors = validateCapabilitySubscriptionAndEntitlementReadiness(value);
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
    decision: evaluateCapabilitySubscriptionAndEntitlementReadiness(value)
  };
}

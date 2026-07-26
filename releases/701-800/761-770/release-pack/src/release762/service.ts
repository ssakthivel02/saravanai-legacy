import type { LandingZoneAndAccountSubscriptionFactory } from "./contracts";
import { validateLandingZoneAndAccountSubscriptionFactory } from "./contracts";
import { evaluateLandingZoneAndAccountSubscriptionFactory } from "./policy";

export function assessRelease762(value: LandingZoneAndAccountSubscriptionFactory) {
  const validationErrors = validateLandingZoneAndAccountSubscriptionFactory(value);
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
    decision: evaluateLandingZoneAndAccountSubscriptionFactory(value)
  };
}

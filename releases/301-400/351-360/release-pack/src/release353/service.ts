import type { MarketplacePublisherOnboarding } from "./contracts";
import { validateMarketplacePublisherOnboarding } from "./contracts";
import { evaluateMarketplacePublisherOnboarding } from "./policy";

export function assessRelease353(value: MarketplacePublisherOnboarding) {
  const validationErrors = validateMarketplacePublisherOnboarding(value);
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
    decision: evaluateMarketplacePublisherOnboarding(value)
  };
}

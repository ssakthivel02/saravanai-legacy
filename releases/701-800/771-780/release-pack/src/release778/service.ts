import type { DataProductMarketplaceAndDiscovery } from "./contracts";
import { validateDataProductMarketplaceAndDiscovery } from "./contracts";
import { evaluateDataProductMarketplaceAndDiscovery } from "./policy";

export function assessRelease778(value: DataProductMarketplaceAndDiscovery) {
  const validationErrors = validateDataProductMarketplaceAndDiscovery(value);
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
    decision: evaluateDataProductMarketplaceAndDiscovery(value)
  };
}

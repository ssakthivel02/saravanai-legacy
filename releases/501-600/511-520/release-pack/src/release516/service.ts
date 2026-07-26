import type { BrandAssetAndDesignSystemGovernance } from "./contracts";
import { validateBrandAssetAndDesignSystemGovernance } from "./contracts";
import { evaluateBrandAssetAndDesignSystemGovernance } from "./policy";

export function assessRelease516(value: BrandAssetAndDesignSystemGovernance) {
  const validationErrors = validateBrandAssetAndDesignSystemGovernance(value);
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
    decision: evaluateBrandAssetAndDesignSystemGovernance(value)
  };
}

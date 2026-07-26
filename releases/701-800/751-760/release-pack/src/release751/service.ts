import type { IndustrialAssetAndSiteRegistry } from "./contracts";
import { validateIndustrialAssetAndSiteRegistry } from "./contracts";
import { evaluateIndustrialAssetAndSiteRegistry } from "./policy";

export function assessRelease751(value: IndustrialAssetAndSiteRegistry) {
  const validationErrors = validateIndustrialAssetAndSiteRegistry(value);
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
    decision: evaluateIndustrialAssetAndSiteRegistry(value)
  };
}

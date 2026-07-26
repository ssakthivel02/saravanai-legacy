import type { PlatformAPIProductCatalogue } from "./contracts";
import { validatePlatformAPIProductCatalogue } from "./contracts";
import { evaluatePlatformAPIProductCatalogue } from "./policy";

export function assessRelease331(value: PlatformAPIProductCatalogue) {
  const validationErrors = validatePlatformAPIProductCatalogue(value);
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
    decision: evaluatePlatformAPIProductCatalogue(value)
  };
}

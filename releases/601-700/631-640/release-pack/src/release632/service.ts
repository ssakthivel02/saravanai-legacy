import type { PurposeAndProcessingActivityCatalogue } from "./contracts";
import { validatePurposeAndProcessingActivityCatalogue } from "./contracts";
import { evaluatePurposeAndProcessingActivityCatalogue } from "./policy";

export function assessRelease632(value: PurposeAndProcessingActivityCatalogue) {
  const validationErrors = validatePurposeAndProcessingActivityCatalogue(value);
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
    decision: evaluatePurposeAndProcessingActivityCatalogue(value)
  };
}

import type { DeveloperPortalAndServiceCatalogue } from "./contracts";
import { validateDeveloperPortalAndServiceCatalogue } from "./contracts";
import { evaluateDeveloperPortalAndServiceCatalogue } from "./policy";

export function assessRelease335(value: DeveloperPortalAndServiceCatalogue) {
  const validationErrors = validateDeveloperPortalAndServiceCatalogue(value);
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
    decision: evaluateDeveloperPortalAndServiceCatalogue(value)
  };
}

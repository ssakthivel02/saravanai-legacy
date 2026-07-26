import type { EnterprisePlatformV7CapabilityCatalogue } from "./contracts";
import { validateEnterprisePlatformV7CapabilityCatalogue } from "./contracts";
import { evaluateEnterprisePlatformV7CapabilityCatalogue } from "./policy";

export function assessRelease791(value: EnterprisePlatformV7CapabilityCatalogue) {
  const validationErrors = validateEnterprisePlatformV7CapabilityCatalogue(value);
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
    decision: evaluateEnterprisePlatformV7CapabilityCatalogue(value)
  };
}

import type { EnterprisePlatformV6CapabilityCatalogue } from "./contracts";
import { validateEnterprisePlatformV6CapabilityCatalogue } from "./contracts";
import { evaluateEnterprisePlatformV6CapabilityCatalogue } from "./policy";

export function assessRelease691(value: EnterprisePlatformV6CapabilityCatalogue) {
  const validationErrors = validateEnterprisePlatformV6CapabilityCatalogue(value);
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
    decision: evaluateEnterprisePlatformV6CapabilityCatalogue(value)
  };
}

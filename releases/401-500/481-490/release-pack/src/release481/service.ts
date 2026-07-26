import type { GlobalPrivacyJurisdictionRegistry } from "./contracts";
import { validateGlobalPrivacyJurisdictionRegistry } from "./contracts";
import { evaluateGlobalPrivacyJurisdictionRegistry } from "./policy";

export function assessRelease481(value: GlobalPrivacyJurisdictionRegistry) {
  const validationErrors = validateGlobalPrivacyJurisdictionRegistry(value);
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
    decision: evaluateGlobalPrivacyJurisdictionRegistry(value)
  };
}

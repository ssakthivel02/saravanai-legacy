import type { IdentityPrivacyAndSelectiveDisclosure } from "./contracts";
import { validateIdentityPrivacyAndSelectiveDisclosure } from "./contracts";
import { evaluateIdentityPrivacyAndSelectiveDisclosure } from "./policy";

export function assessRelease549(value: IdentityPrivacyAndSelectiveDisclosure) {
  const validationErrors = validateIdentityPrivacyAndSelectiveDisclosure(value);
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
    decision: evaluateIdentityPrivacyAndSelectiveDisclosure(value)
  };
}

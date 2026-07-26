import type { PartnerFederationAndDelegatedAccess } from "./contracts";
import { validatePartnerFederationAndDelegatedAccess } from "./contracts";
import { evaluatePartnerFederationAndDelegatedAccess } from "./policy";

export function assessRelease527(value: PartnerFederationAndDelegatedAccess) {
  const validationErrors = validatePartnerFederationAndDelegatedAccess(value);
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
    decision: evaluatePartnerFederationAndDelegatedAccess(value)
  };
}

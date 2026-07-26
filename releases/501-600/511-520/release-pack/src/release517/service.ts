import type { RightsLicensingAndConsentManagement } from "./contracts";
import { validateRightsLicensingAndConsentManagement } from "./contracts";
import { evaluateRightsLicensingAndConsentManagement } from "./policy";

export function assessRelease517(value: RightsLicensingAndConsentManagement) {
  const validationErrors = validateRightsLicensingAndConsentManagement(value);
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
    decision: evaluateRightsLicensingAndConsentManagement(value)
  };
}

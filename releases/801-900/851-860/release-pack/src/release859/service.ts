import type { TrustIncidentDisclosureAndCorrection } from "./contracts";
import { validateTrustIncidentDisclosureAndCorrection } from "./contracts";
import { evaluateTrustIncidentDisclosureAndCorrection } from "./policy";

export function assessRelease859(value: TrustIncidentDisclosureAndCorrection) {
  const validationErrors = validateTrustIncidentDisclosureAndCorrection(value);
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
    decision: evaluateTrustIncidentDisclosureAndCorrection(value)
  };
}

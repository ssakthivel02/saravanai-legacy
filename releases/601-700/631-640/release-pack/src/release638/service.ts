import type { PrivacyIncidentAndBreachAssessment } from "./contracts";
import { validatePrivacyIncidentAndBreachAssessment } from "./contracts";
import { evaluatePrivacyIncidentAndBreachAssessment } from "./policy";

export function assessRelease638(value: PrivacyIncidentAndBreachAssessment) {
  const validationErrors = validatePrivacyIncidentAndBreachAssessment(value);
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
    decision: evaluatePrivacyIncidentAndBreachAssessment(value)
  };
}

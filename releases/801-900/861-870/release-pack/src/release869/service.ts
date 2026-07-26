import type { RegionalIncidentNotificationAndSupport } from "./contracts";
import { validateRegionalIncidentNotificationAndSupport } from "./contracts";
import { evaluateRegionalIncidentNotificationAndSupport } from "./policy";

export function assessRelease869(value: RegionalIncidentNotificationAndSupport) {
  const validationErrors = validateRegionalIncidentNotificationAndSupport(value);
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
    decision: evaluateRegionalIncidentNotificationAndSupport(value)
  };
}

import type { RegionalConsentAndNoticeOrchestration } from "./contracts";
import { validateRegionalConsentAndNoticeOrchestration } from "./contracts";
import { evaluateRegionalConsentAndNoticeOrchestration } from "./policy";

export function assessRelease867(value: RegionalConsentAndNoticeOrchestration) {
  const validationErrors = validateRegionalConsentAndNoticeOrchestration(value);
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
    decision: evaluateRegionalConsentAndNoticeOrchestration(value)
  };
}

import type { MeetingIntelligenceAndConsent } from "./contracts";
import { validateMeetingIntelligenceAndConsent } from "./contracts";
import { evaluateMeetingIntelligenceAndConsent } from "./policy";

export function assessRelease553(value: MeetingIntelligenceAndConsent) {
  const validationErrors = validateMeetingIntelligenceAndConsent(value);
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
    decision: evaluateMeetingIntelligenceAndConsent(value)
  };
}

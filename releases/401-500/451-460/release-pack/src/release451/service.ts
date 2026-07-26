import type { OmnichannelJourneyOrchestration } from "./contracts";
import { validateOmnichannelJourneyOrchestration } from "./contracts";
import { evaluateOmnichannelJourneyOrchestration } from "./policy";

export function assessRelease451(value: OmnichannelJourneyOrchestration) {
  const validationErrors = validateOmnichannelJourneyOrchestration(value);
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
    decision: evaluateOmnichannelJourneyOrchestration(value)
  };
}

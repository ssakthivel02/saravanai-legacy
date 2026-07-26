import type { IncidentIntelligenceAndTriageAssistant } from "./contracts";
import { validateIncidentIntelligenceAndTriageAssistant } from "./contracts";
import { evaluateIncidentIntelligenceAndTriageAssistant } from "./policy";

export function assessRelease665(value: IncidentIntelligenceAndTriageAssistant) {
  const validationErrors = validateIncidentIntelligenceAndTriageAssistant(value);
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
    decision: evaluateIncidentIntelligenceAndTriageAssistant(value)
  };
}

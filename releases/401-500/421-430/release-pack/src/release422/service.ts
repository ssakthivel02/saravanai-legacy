import type { ThreatIntelligenceSourceGovernance } from "./contracts";
import { validateThreatIntelligenceSourceGovernance } from "./contracts";
import { evaluateThreatIntelligenceSourceGovernance } from "./policy";

export function assessRelease422(value: ThreatIntelligenceSourceGovernance) {
  const validationErrors = validateThreatIntelligenceSourceGovernance(value);
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
    decision: evaluateThreatIntelligenceSourceGovernance(value)
  };
}

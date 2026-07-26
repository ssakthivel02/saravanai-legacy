import type { EngineeringIntelligenceAssuranceGate } from "./contracts";
import { validateEngineeringIntelligenceAssuranceGate } from "./contracts";
import { evaluateEngineeringIntelligenceAssuranceGate } from "./policy";

export function assessRelease480(value: EngineeringIntelligenceAssuranceGate) {
  const validationErrors = validateEngineeringIntelligenceAssuranceGate(value);
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
    decision: evaluateEngineeringIntelligenceAssuranceGate(value)
  };
}

import type { DataIntelligenceAssuranceGate } from "./contracts";
import { validateDataIntelligenceAssuranceGate } from "./contracts";
import { evaluateDataIntelligenceAssuranceGate } from "./policy";

export function assessRelease350(value: DataIntelligenceAssuranceGate) {
  const validationErrors = validateDataIntelligenceAssuranceGate(value);
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
    decision: evaluateDataIntelligenceAssuranceGate(value)
  };
}

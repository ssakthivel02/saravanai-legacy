import type { ExecutiveIntelligenceAndResilienceGate } from "./contracts";
import { validateExecutiveIntelligenceAndResilienceGate } from "./contracts";
import { evaluateExecutiveIntelligenceAndResilienceGate } from "./policy";

export function assessRelease790(value: ExecutiveIntelligenceAndResilienceGate) {
  const validationErrors = validateExecutiveIntelligenceAndResilienceGate(value);
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
    decision: evaluateExecutiveIntelligenceAndResilienceGate(value)
  };
}

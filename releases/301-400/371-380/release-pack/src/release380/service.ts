import type { GlobalResilienceAssuranceGate } from "./contracts";
import { validateGlobalResilienceAssuranceGate } from "./contracts";
import { evaluateGlobalResilienceAssuranceGate } from "./policy";

export function assessRelease380(value: GlobalResilienceAssuranceGate) {
  const validationErrors = validateGlobalResilienceAssuranceGate(value);
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
    decision: evaluateGlobalResilienceAssuranceGate(value)
  };
}

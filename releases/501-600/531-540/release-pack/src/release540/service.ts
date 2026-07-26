import type { CyberResilienceAssuranceGate } from "./contracts";
import { validateCyberResilienceAssuranceGate } from "./contracts";
import { evaluateCyberResilienceAssuranceGate } from "./policy";

export function assessRelease540(value: CyberResilienceAssuranceGate) {
  const validationErrors = validateCyberResilienceAssuranceGate(value);
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
    decision: evaluateCyberResilienceAssuranceGate(value)
  };
}

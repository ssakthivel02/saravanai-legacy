import type { GlobalExperienceAssuranceGate } from "./contracts";
import { validateGlobalExperienceAssuranceGate } from "./contracts";
import { evaluateGlobalExperienceAssuranceGate } from "./policy";

export function assessRelease590(value: GlobalExperienceAssuranceGate) {
  const validationErrors = validateGlobalExperienceAssuranceGate(value);
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
    decision: evaluateGlobalExperienceAssuranceGate(value)
  };
}

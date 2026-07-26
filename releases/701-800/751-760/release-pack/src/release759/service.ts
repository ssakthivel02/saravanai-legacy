import type { IndustrialContinuityAndManualFallback } from "./contracts";
import { validateIndustrialContinuityAndManualFallback } from "./contracts";
import { evaluateIndustrialContinuityAndManualFallback } from "./policy";

export function assessRelease759(value: IndustrialContinuityAndManualFallback) {
  const validationErrors = validateIndustrialContinuityAndManualFallback(value);
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
    decision: evaluateIndustrialContinuityAndManualFallback(value)
  };
}

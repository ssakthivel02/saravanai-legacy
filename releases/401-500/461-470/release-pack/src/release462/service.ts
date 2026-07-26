import type { CarbonAwareWorkloadSchedulingV2 } from "./contracts";
import { validateCarbonAwareWorkloadSchedulingV2 } from "./contracts";
import { evaluateCarbonAwareWorkloadSchedulingV2 } from "./policy";

export function assessRelease462(value: CarbonAwareWorkloadSchedulingV2) {
  const validationErrors = validateCarbonAwareWorkloadSchedulingV2(value);
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
    decision: evaluateCarbonAwareWorkloadSchedulingV2(value)
  };
}

import type { ContinuousControlMonitoringV2 } from "./contracts";
import { validateContinuousControlMonitoringV2 } from "./contracts";
import { evaluateContinuousControlMonitoringV2 } from "./policy";

export function assessRelease593(value: ContinuousControlMonitoringV2) {
  const validationErrors = validateContinuousControlMonitoringV2(value);
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
    decision: evaluateContinuousControlMonitoringV2(value)
  };
}

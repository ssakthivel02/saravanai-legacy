import type { HardwareLifecycleAndCircularity } from "./contracts";
import { validateHardwareLifecycleAndCircularity } from "./contracts";
import { evaluateHardwareLifecycleAndCircularity } from "./policy";

export function assessRelease464(value: HardwareLifecycleAndCircularity) {
  const validationErrors = validateHardwareLifecycleAndCircularity(value);
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
    decision: evaluateHardwareLifecycleAndCircularity(value)
  };
}

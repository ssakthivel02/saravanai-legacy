import type { UnifiedWorkQueueAndPersonalProductivity } from "./contracts";
import { validateUnifiedWorkQueueAndPersonalProductivity } from "./contracts";
import { evaluateUnifiedWorkQueueAndPersonalProductivity } from "./policy";

export function assessRelease551(value: UnifiedWorkQueueAndPersonalProductivity) {
  const validationErrors = validateUnifiedWorkQueueAndPersonalProductivity(value);
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
    decision: evaluateUnifiedWorkQueueAndPersonalProductivity(value)
  };
}

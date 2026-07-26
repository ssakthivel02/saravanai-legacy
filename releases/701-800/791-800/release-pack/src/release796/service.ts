import type { GlobalRolloutAndRegionalReadinessV3 } from "./contracts";
import { validateGlobalRolloutAndRegionalReadinessV3 } from "./contracts";
import { evaluateGlobalRolloutAndRegionalReadinessV3 } from "./policy";

export function assessRelease796(value: GlobalRolloutAndRegionalReadinessV3) {
  const validationErrors = validateGlobalRolloutAndRegionalReadinessV3(value);
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
    decision: evaluateGlobalRolloutAndRegionalReadinessV3(value)
  };
}

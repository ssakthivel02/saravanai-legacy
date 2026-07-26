import type { GlobalLaunchAndRegionalRollout } from "./contracts";
import { validateGlobalLaunchAndRegionalRollout } from "./contracts";
import { evaluateGlobalLaunchAndRegionalRollout } from "./policy";

export function assessRelease494(value: GlobalLaunchAndRegionalRollout) {
  const validationErrors = validateGlobalLaunchAndRegionalRollout(value);
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
    decision: evaluateGlobalLaunchAndRegionalRollout(value)
  };
}

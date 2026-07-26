import type { ProviderExitAndBusinessContinuityV2 } from "./contracts";
import { validateProviderExitAndBusinessContinuityV2 } from "./contracts";
import { evaluateProviderExitAndBusinessContinuityV2 } from "./policy";

export function assessRelease498(value: ProviderExitAndBusinessContinuityV2) {
  const validationErrors = validateProviderExitAndBusinessContinuityV2(value);
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
    decision: evaluateProviderExitAndBusinessContinuityV2(value)
  };
}

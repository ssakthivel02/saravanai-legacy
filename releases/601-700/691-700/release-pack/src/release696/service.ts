import type { ServiceContinuityAndProviderExitV4 } from "./contracts";
import { validateServiceContinuityAndProviderExitV4 } from "./contracts";
import { evaluateServiceContinuityAndProviderExitV4 } from "./policy";

export function assessRelease696(value: ServiceContinuityAndProviderExitV4) {
  const validationErrors = validateServiceContinuityAndProviderExitV4(value);
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
    decision: evaluateServiceContinuityAndProviderExitV4(value)
  };
}

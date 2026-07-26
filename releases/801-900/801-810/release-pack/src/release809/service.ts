import type { IdentityRuntimeObservabilityAndAbuseDetection } from "./contracts";
import { validateIdentityRuntimeObservabilityAndAbuseDetection } from "./contracts";
import { evaluateIdentityRuntimeObservabilityAndAbuseDetection } from "./policy";

export function assessRelease809(value: IdentityRuntimeObservabilityAndAbuseDetection) {
  const validationErrors = validateIdentityRuntimeObservabilityAndAbuseDetection(value);
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
    decision: evaluateIdentityRuntimeObservabilityAndAbuseDetection(value)
  };
}

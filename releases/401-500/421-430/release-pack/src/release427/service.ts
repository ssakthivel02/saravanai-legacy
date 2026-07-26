import type { IdentityThreatDetectionAndResponseV2 } from "./contracts";
import { validateIdentityThreatDetectionAndResponseV2 } from "./contracts";
import { evaluateIdentityThreatDetectionAndResponseV2 } from "./policy";

export function assessRelease427(value: IdentityThreatDetectionAndResponseV2) {
  const validationErrors = validateIdentityThreatDetectionAndResponseV2(value);
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
    decision: evaluateIdentityThreatDetectionAndResponseV2(value)
  };
}

import type { DigitalIdentityTrustFramework } from "./contracts";
import { validateDigitalIdentityTrustFramework } from "./contracts";
import { evaluateDigitalIdentityTrustFramework } from "./policy";

export function assessRelease484(value: DigitalIdentityTrustFramework) {
  const validationErrors = validateDigitalIdentityTrustFramework(value);
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
    decision: evaluateDigitalIdentityTrustFramework(value)
  };
}

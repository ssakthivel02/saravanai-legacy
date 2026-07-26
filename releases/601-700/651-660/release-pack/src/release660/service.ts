import type { SecureDeveloperPlatformAssuranceGate } from "./contracts";
import { validateSecureDeveloperPlatformAssuranceGate } from "./contracts";
import { evaluateSecureDeveloperPlatformAssuranceGate } from "./policy";

export function assessRelease660(value: SecureDeveloperPlatformAssuranceGate) {
  const validationErrors = validateSecureDeveloperPlatformAssuranceGate(value);
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
    decision: evaluateSecureDeveloperPlatformAssuranceGate(value)
  };
}

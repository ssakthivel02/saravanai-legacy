import type { PlatformEngineeringAssuranceGate } from "./contracts";
import { validatePlatformEngineeringAssuranceGate } from "./contracts";
import { evaluatePlatformEngineeringAssuranceGate } from "./policy";

export function assessRelease340(value: PlatformEngineeringAssuranceGate) {
  const validationErrors = validatePlatformEngineeringAssuranceGate(value);
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
    decision: evaluatePlatformEngineeringAssuranceGate(value)
  };
}

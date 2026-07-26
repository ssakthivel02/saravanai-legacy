import type { GovernedDataPlatformAssuranceGate } from "./contracts";
import { validateGovernedDataPlatformAssuranceGate } from "./contracts";
import { evaluateGovernedDataPlatformAssuranceGate } from "./policy";

export function assessRelease440(value: GovernedDataPlatformAssuranceGate) {
  const validationErrors = validateGovernedDataPlatformAssuranceGate(value);
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
    decision: evaluateGovernedDataPlatformAssuranceGate(value)
  };
}

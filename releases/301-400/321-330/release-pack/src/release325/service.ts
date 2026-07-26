import type { SecureEnclaveWorkloadGovernance } from "./contracts";
import { validateSecureEnclaveWorkloadGovernance } from "./contracts";
import { evaluateSecureEnclaveWorkloadGovernance } from "./policy";

export function assessRelease325(value: SecureEnclaveWorkloadGovernance) {
  const validationErrors = validateSecureEnclaveWorkloadGovernance(value);
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
    decision: evaluateSecureEnclaveWorkloadGovernance(value)
  };
}

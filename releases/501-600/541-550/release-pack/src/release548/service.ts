import type { FederationAndTrustBrokerOperations } from "./contracts";
import { validateFederationAndTrustBrokerOperations } from "./contracts";
import { evaluateFederationAndTrustBrokerOperations } from "./policy";

export function assessRelease548(value: FederationAndTrustBrokerOperations) {
  const validationErrors = validateFederationAndTrustBrokerOperations(value);
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
    decision: evaluateFederationAndTrustBrokerOperations(value)
  };
}

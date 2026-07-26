import type { VerifiableCredentialReadiness } from "./contracts";
import { validateVerifiableCredentialReadiness } from "./contracts";
import { evaluateVerifiableCredentialReadiness } from "./policy";

export function assessRelease544(value: VerifiableCredentialReadiness) {
  const validationErrors = validateVerifiableCredentialReadiness(value);
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
    decision: evaluateVerifiableCredentialReadiness(value)
  };
}

import type { CredentialIssuanceAndLifecycle } from "./contracts";
import { validateCredentialIssuanceAndLifecycle } from "./contracts";
import { evaluateCredentialIssuanceAndLifecycle } from "./policy";

export function assessRelease542(value: CredentialIssuanceAndLifecycle) {
  const validationErrors = validateCredentialIssuanceAndLifecycle(value);
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
    decision: evaluateCredentialIssuanceAndLifecycle(value)
  };
}

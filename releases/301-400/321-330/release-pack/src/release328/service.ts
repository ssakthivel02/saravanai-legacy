import type { SecurityPolicyVerificationAndModelChecking } from "./contracts";
import { validateSecurityPolicyVerificationAndModelChecking } from "./contracts";
import { evaluateSecurityPolicyVerificationAndModelChecking } from "./policy";

export function assessRelease328(value: SecurityPolicyVerificationAndModelChecking) {
  const validationErrors = validateSecurityPolicyVerificationAndModelChecking(value);
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
    decision: evaluateSecurityPolicyVerificationAndModelChecking(value)
  };
}

import type { PrivilegedIdentityGovernanceV2 } from "./contracts";
import { validatePrivilegedIdentityGovernanceV2 } from "./contracts";
import { evaluatePrivilegedIdentityGovernanceV2 } from "./policy";

export function assessRelease546(value: PrivilegedIdentityGovernanceV2) {
  const validationErrors = validatePrivilegedIdentityGovernanceV2(value);
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
    decision: evaluatePrivilegedIdentityGovernanceV2(value)
  };
}

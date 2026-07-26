import type { IssueFindingAndRemediationManagement } from "./contracts";
import { validateIssueFindingAndRemediationManagement } from "./contracts";
import { evaluateIssueFindingAndRemediationManagement } from "./policy";

export function assessRelease685(value: IssueFindingAndRemediationManagement) {
  const validationErrors = validateIssueFindingAndRemediationManagement(value);
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
    decision: evaluateIssueFindingAndRemediationManagement(value)
  };
}

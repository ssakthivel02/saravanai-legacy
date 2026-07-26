import type { SecurityOperationsCaseManagement } from "./contracts";
import { validateSecurityOperationsCaseManagement } from "./contracts";
import { evaluateSecurityOperationsCaseManagement } from "./policy";

export function assessRelease421(value: SecurityOperationsCaseManagement) {
  const validationErrors = validateSecurityOperationsCaseManagement(value);
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
    decision: evaluateSecurityOperationsCaseManagement(value)
  };
}

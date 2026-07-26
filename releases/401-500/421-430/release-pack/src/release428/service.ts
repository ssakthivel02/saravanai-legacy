import type { CloudAndSaaSSecurityPostureOperations } from "./contracts";
import { validateCloudAndSaaSSecurityPostureOperations } from "./contracts";
import { evaluateCloudAndSaaSSecurityPostureOperations } from "./policy";

export function assessRelease428(value: CloudAndSaaSSecurityPostureOperations) {
  const validationErrors = validateCloudAndSaaSSecurityPostureOperations(value);
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
    decision: evaluateCloudAndSaaSSecurityPostureOperations(value)
  };
}

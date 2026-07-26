import type { CloudSecurityPostureAndConfigurationDrift } from "./contracts";
import { validateCloudSecurityPostureAndConfigurationDrift } from "./contracts";
import { evaluateCloudSecurityPostureAndConfigurationDrift } from "./policy";

export function assessRelease768(value: CloudSecurityPostureAndConfigurationDrift) {
  const validationErrors = validateCloudSecurityPostureAndConfigurationDrift(value);
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
    decision: evaluateCloudSecurityPostureAndConfigurationDrift(value)
  };
}

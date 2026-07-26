import type { ServiceManagementOperatingModelV3 } from "./contracts";
import { validateServiceManagementOperatingModelV3 } from "./contracts";
import { evaluateServiceManagementOperatingModelV3 } from "./policy";

export function assessRelease591(value: ServiceManagementOperatingModelV3) {
  const validationErrors = validateServiceManagementOperatingModelV3(value);
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
    decision: evaluateServiceManagementOperatingModelV3(value)
  };
}

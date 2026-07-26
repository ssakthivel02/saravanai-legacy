import type { CloudControlPlaneRecovery } from "./contracts";
import { validateCloudControlPlaneRecovery } from "./contracts";
import { evaluateCloudControlPlaneRecovery } from "./policy";

export function assessRelease535(value: CloudControlPlaneRecovery) {
  const validationErrors = validateCloudControlPlaneRecovery(value);
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
    decision: evaluateCloudControlPlaneRecovery(value)
  };
}

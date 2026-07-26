import type { WorkloadIdentityAndSPIFFEReadiness } from "./contracts";
import { validateWorkloadIdentityAndSPIFFEReadiness } from "./contracts";
import { evaluateWorkloadIdentityAndSPIFFEReadiness } from "./policy";

export function assessRelease327(value: WorkloadIdentityAndSPIFFEReadiness) {
  const validationErrors = validateWorkloadIdentityAndSPIFFEReadiness(value);
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
    decision: evaluateWorkloadIdentityAndSPIFFEReadiness(value)
  };
}

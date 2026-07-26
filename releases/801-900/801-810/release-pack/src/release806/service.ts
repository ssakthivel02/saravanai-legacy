import type { APIKeyAndWorkloadIdentityRuntime } from "./contracts";
import { validateAPIKeyAndWorkloadIdentityRuntime } from "./contracts";
import { evaluateAPIKeyAndWorkloadIdentityRuntime } from "./policy";

export function assessRelease806(value: APIKeyAndWorkloadIdentityRuntime) {
  const validationErrors = validateAPIKeyAndWorkloadIdentityRuntime(value);
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
    decision: evaluateAPIKeyAndWorkloadIdentityRuntime(value)
  };
}

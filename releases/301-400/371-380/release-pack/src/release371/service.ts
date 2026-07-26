import type { GlobalSREControlPlane } from "./contracts";
import { validateGlobalSREControlPlane } from "./contracts";
import { evaluateGlobalSREControlPlane } from "./policy";

export function assessRelease371(value: GlobalSREControlPlane) {
  const validationErrors = validateGlobalSREControlPlane(value);
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
    decision: evaluateGlobalSREControlPlane(value)
  };
}

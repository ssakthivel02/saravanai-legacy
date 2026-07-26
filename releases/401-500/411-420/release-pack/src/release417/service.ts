import type { OfflineUpdateAndPatchGovernance } from "./contracts";
import { validateOfflineUpdateAndPatchGovernance } from "./contracts";
import { evaluateOfflineUpdateAndPatchGovernance } from "./policy";

export function assessRelease417(value: OfflineUpdateAndPatchGovernance) {
  const validationErrors = validateOfflineUpdateAndPatchGovernance(value);
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
    decision: evaluateOfflineUpdateAndPatchGovernance(value)
  };
}

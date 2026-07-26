import type { PartnerAndResellerWorkspace } from "./contracts";
import { validatePartnerAndResellerWorkspace } from "./contracts";
import { evaluatePartnerAndResellerWorkspace } from "./policy";

export function assessRelease352(value: PartnerAndResellerWorkspace) {
  const validationErrors = validatePartnerAndResellerWorkspace(value);
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
    decision: evaluatePartnerAndResellerWorkspace(value)
  };
}

import type { ContradictionAndSourceConflictResolver } from "./contracts";
import { validateContradictionAndSourceConflictResolver } from "./contracts";
import { evaluateContradictionAndSourceConflictResolver } from "./policy";

export function assessRelease837(value: ContradictionAndSourceConflictResolver) {
  const validationErrors = validateContradictionAndSourceConflictResolver(value);
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
    decision: evaluateContradictionAndSourceConflictResolver(value)
  };
}

import type { EditorialIndependenceAndConflictDisclosure } from "./contracts";
import { validateEditorialIndependenceAndConflictDisclosure } from "./contracts";
import { evaluateEditorialIndependenceAndConflictDisclosure } from "./policy";

export function assessRelease389(value: EditorialIndependenceAndConflictDisclosure) {
  const validationErrors = validateEditorialIndependenceAndConflictDisclosure(value);
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
    decision: evaluateEditorialIndependenceAndConflictDisclosure(value)
  };
}

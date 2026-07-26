import type { ResponsibleInnovationReviewBoard } from "./contracts";
import { validateResponsibleInnovationReviewBoard } from "./contracts";
import { evaluateResponsibleInnovationReviewBoard } from "./policy";

export function assessRelease468(value: ResponsibleInnovationReviewBoard) {
  const validationErrors = validateResponsibleInnovationReviewBoard(value);
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
    decision: evaluateResponsibleInnovationReviewBoard(value)
  };
}

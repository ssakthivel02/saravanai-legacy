import type { AssessmentQuestionBankAndIntegrity } from "./contracts";
import { validateAssessmentQuestionBankAndIntegrity } from "./contracts";
import { evaluateAssessmentQuestionBankAndIntegrity } from "./policy";

export function assessRelease744(value: AssessmentQuestionBankAndIntegrity) {
  const validationErrors = validateAssessmentQuestionBankAndIntegrity(value);
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
    decision: evaluateAssessmentQuestionBankAndIntegrity(value)
  };
}

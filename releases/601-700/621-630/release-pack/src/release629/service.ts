import type { KnowledgeFeedbackAndCorrectionWorkflow } from "./contracts";
import { validateKnowledgeFeedbackAndCorrectionWorkflow } from "./contracts";
import { evaluateKnowledgeFeedbackAndCorrectionWorkflow } from "./policy";

export function assessRelease629(value: KnowledgeFeedbackAndCorrectionWorkflow) {
  const validationErrors = validateKnowledgeFeedbackAndCorrectionWorkflow(value);
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
    decision: evaluateKnowledgeFeedbackAndCorrectionWorkflow(value)
  };
}

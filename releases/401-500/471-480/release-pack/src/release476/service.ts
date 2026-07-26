import type { EngineeringKnowledgeAndDecisionRecords } from "./contracts";
import { validateEngineeringKnowledgeAndDecisionRecords } from "./contracts";
import { evaluateEngineeringKnowledgeAndDecisionRecords } from "./policy";

export function assessRelease476(value: EngineeringKnowledgeAndDecisionRecords) {
  const validationErrors = validateEngineeringKnowledgeAndDecisionRecords(value);
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
    decision: evaluateEngineeringKnowledgeAndDecisionRecords(value)
  };
}

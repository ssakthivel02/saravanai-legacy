import type { CaseResolutionAndKnowledgeGuidance } from "./contracts";
import { validateCaseResolutionAndKnowledgeGuidance } from "./contracts";
import { evaluateCaseResolutionAndKnowledgeGuidance } from "./policy";

export function assessRelease736(value: CaseResolutionAndKnowledgeGuidance) {
  const validationErrors = validateCaseResolutionAndKnowledgeGuidance(value);
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
    decision: evaluateCaseResolutionAndKnowledgeGuidance(value)
  };
}

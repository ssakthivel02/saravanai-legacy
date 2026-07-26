import type { ResearchQuestionAndScopeRegistry } from "./contracts";
import { validateResearchQuestionAndScopeRegistry } from "./contracts";
import { evaluateResearchQuestionAndScopeRegistry } from "./policy";

export function assessRelease711(value: ResearchQuestionAndScopeRegistry) {
  const validationErrors = validateResearchQuestionAndScopeRegistry(value);
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
    decision: evaluateResearchQuestionAndScopeRegistry(value)
  };
}

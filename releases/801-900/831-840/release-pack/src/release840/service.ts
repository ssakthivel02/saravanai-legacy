import type { KnowledgeAndResearchRuntimeActivationGate } from "./contracts";
import { validateKnowledgeAndResearchRuntimeActivationGate } from "./contracts";
import { evaluateKnowledgeAndResearchRuntimeActivationGate } from "./policy";

export function assessRelease840(value: KnowledgeAndResearchRuntimeActivationGate) {
  const validationErrors = validateKnowledgeAndResearchRuntimeActivationGate(value);
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
    decision: evaluateKnowledgeAndResearchRuntimeActivationGate(value)
  };
}

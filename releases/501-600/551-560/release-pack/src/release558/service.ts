import type { KnowledgeWorkerAccessibilityAndInclusion } from "./contracts";
import { validateKnowledgeWorkerAccessibilityAndInclusion } from "./contracts";
import { evaluateKnowledgeWorkerAccessibilityAndInclusion } from "./policy";

export function assessRelease558(value: KnowledgeWorkerAccessibilityAndInclusion) {
  const validationErrors = validateKnowledgeWorkerAccessibilityAndInclusion(value);
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
    decision: evaluateKnowledgeWorkerAccessibilityAndInclusion(value)
  };
}

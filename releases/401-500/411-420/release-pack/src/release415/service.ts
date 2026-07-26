import type { LocalRetrievalAndKnowledgeSynchronisation } from "./contracts";
import { validateLocalRetrievalAndKnowledgeSynchronisation } from "./contracts";
import { evaluateLocalRetrievalAndKnowledgeSynchronisation } from "./policy";

export function assessRelease415(value: LocalRetrievalAndKnowledgeSynchronisation) {
  const validationErrors = validateLocalRetrievalAndKnowledgeSynchronisation(value);
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
    decision: evaluateLocalRetrievalAndKnowledgeSynchronisation(value)
  };
}

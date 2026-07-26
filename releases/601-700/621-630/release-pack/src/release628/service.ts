import type { KnowledgeConflictAndCanonicalResolution } from "./contracts";
import { validateKnowledgeConflictAndCanonicalResolution } from "./contracts";
import { evaluateKnowledgeConflictAndCanonicalResolution } from "./policy";

export function assessRelease628(value: KnowledgeConflictAndCanonicalResolution) {
  const validationErrors = validateKnowledgeConflictAndCanonicalResolution(value);
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
    decision: evaluateKnowledgeConflictAndCanonicalResolution(value)
  };
}

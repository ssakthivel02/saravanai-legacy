import type { KnowledgeCorrectionReindexAndNotification } from "./contracts";
import { validateKnowledgeCorrectionReindexAndNotification } from "./contracts";
import { evaluateKnowledgeCorrectionReindexAndNotification } from "./policy";

export function assessRelease839(value: KnowledgeCorrectionReindexAndNotification) {
  const validationErrors = validateKnowledgeCorrectionReindexAndNotification(value);
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
    decision: evaluateKnowledgeCorrectionReindexAndNotification(value)
  };
}

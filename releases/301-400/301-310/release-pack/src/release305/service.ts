import type { DataAndKnowledgeTwin } from "./contracts";
import { validateDataAndKnowledgeTwin } from "./contracts";
import { evaluateDataAndKnowledgeTwin } from "./policy";

export function assessRelease305(value: DataAndKnowledgeTwin) {
  const validationErrors = validateDataAndKnowledgeTwin(value);
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
    decision: evaluateDataAndKnowledgeTwin(value)
  };
}

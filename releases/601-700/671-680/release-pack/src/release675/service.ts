import type { DocumentAndFormAutomation } from "./contracts";
import { validateDocumentAndFormAutomation } from "./contracts";
import { evaluateDocumentAndFormAutomation } from "./policy";

export function assessRelease675(value: DocumentAndFormAutomation) {
  const validationErrors = validateDocumentAndFormAutomation(value);
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
    decision: evaluateDocumentAndFormAutomation(value)
  };
}

import type { DocumentCollaborationAndVersionControl } from "./contracts";
import { validateDocumentCollaborationAndVersionControl } from "./contracts";
import { evaluateDocumentCollaborationAndVersionControl } from "./policy";

export function assessRelease554(value: DocumentCollaborationAndVersionControl) {
  const validationErrors = validateDocumentCollaborationAndVersionControl(value);
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
    decision: evaluateDocumentCollaborationAndVersionControl(value)
  };
}

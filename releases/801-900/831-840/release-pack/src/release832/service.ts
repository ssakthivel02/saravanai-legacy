import type { DocumentIngestionAndQuarantineWorker } from "./contracts";
import { validateDocumentIngestionAndQuarantineWorker } from "./contracts";
import { evaluateDocumentIngestionAndQuarantineWorker } from "./policy";

export function assessRelease832(value: DocumentIngestionAndQuarantineWorker) {
  const validationErrors = validateDocumentIngestionAndQuarantineWorker(value);
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
    decision: evaluateDocumentIngestionAndQuarantineWorker(value)
  };
}

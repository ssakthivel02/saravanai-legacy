import type { DocumentAndPDFGenerationPipeline } from "./contracts";
import { validateDocumentAndPDFGenerationPipeline } from "./contracts";
import { evaluateDocumentAndPDFGenerationPipeline } from "./policy";

export function assessRelease515(value: DocumentAndPDFGenerationPipeline) {
  const validationErrors = validateDocumentAndPDFGenerationPipeline(value);
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
    decision: evaluateDocumentAndPDFGenerationPipeline(value)
  };
}

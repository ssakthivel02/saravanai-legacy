import type { DocumentPresentationAndPDFComposer } from "./contracts";
import { validateDocumentPresentationAndPDFComposer } from "./contracts";
import { evaluateDocumentPresentationAndPDFComposer } from "./policy";

export function assessRelease645(value: DocumentPresentationAndPDFComposer) {
  const validationErrors = validateDocumentPresentationAndPDFComposer(value);
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
    decision: evaluateDocumentPresentationAndPDFComposer(value)
  };
}

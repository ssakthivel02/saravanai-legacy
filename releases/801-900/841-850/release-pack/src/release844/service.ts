import type { DocumentAssetAndVersionWorkspace } from "./contracts";
import { validateDocumentAssetAndVersionWorkspace } from "./contracts";
import { evaluateDocumentAssetAndVersionWorkspace } from "./policy";

export function assessRelease844(value: DocumentAssetAndVersionWorkspace) {
  const validationErrors = validateDocumentAssetAndVersionWorkspace(value);
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
    decision: evaluateDocumentAssetAndVersionWorkspace(value)
  };
}

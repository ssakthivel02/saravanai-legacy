import type { CitationAnchorAndEvidenceResolver } from "./contracts";
import { validateCitationAnchorAndEvidenceResolver } from "./contracts";
import { evaluateCitationAnchorAndEvidenceResolver } from "./policy";

export function assessRelease835(value: CitationAnchorAndEvidenceResolver) {
  const validationErrors = validateCitationAnchorAndEvidenceResolver(value);
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
    decision: evaluateCitationAnchorAndEvidenceResolver(value)
  };
}

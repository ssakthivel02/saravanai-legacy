import type { CitationEvidenceAndSourceTraceability } from "./contracts";
import { validateCitationEvidenceAndSourceTraceability } from "./contracts";
import { evaluateCitationEvidenceAndSourceTraceability } from "./policy";

export function assessRelease626(value: CitationEvidenceAndSourceTraceability) {
  const validationErrors = validateCitationEvidenceAndSourceTraceability(value);
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
    decision: evaluateCitationEvidenceAndSourceTraceability(value)
  };
}

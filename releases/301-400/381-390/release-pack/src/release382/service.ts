import type { CitationAndEvidenceIntegrityV2 } from "./contracts";
import { validateCitationAndEvidenceIntegrityV2 } from "./contracts";
import { evaluateCitationAndEvidenceIntegrityV2 } from "./policy";

export function assessRelease382(value: CitationAndEvidenceIntegrityV2) {
  const validationErrors = validateCitationAndEvidenceIntegrityV2(value);
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
    decision: evaluateCitationAndEvidenceIntegrityV2(value)
  };
}

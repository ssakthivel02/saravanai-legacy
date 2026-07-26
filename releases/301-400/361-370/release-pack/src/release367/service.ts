import type { MediaProvenanceAndElectionIntegrityPattern } from "./contracts";
import { validateMediaProvenanceAndElectionIntegrityPattern } from "./contracts";
import { evaluateMediaProvenanceAndElectionIntegrityPattern } from "./policy";

export function assessRelease367(value: MediaProvenanceAndElectionIntegrityPattern) {
  const validationErrors = validateMediaProvenanceAndElectionIntegrityPattern(value);
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
    decision: evaluateMediaProvenanceAndElectionIntegrityPattern(value)
  };
}

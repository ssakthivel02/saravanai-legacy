import type { ClaimEvidenceAndCitationGraph } from "./contracts";
import { validateClaimEvidenceAndCitationGraph } from "./contracts";
import { evaluateClaimEvidenceAndCitationGraph } from "./policy";

export function assessRelease714(value: ClaimEvidenceAndCitationGraph) {
  const validationErrors = validateClaimEvidenceAndCitationGraph(value);
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
    decision: evaluateClaimEvidenceAndCitationGraph(value)
  };
}

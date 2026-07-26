import type { ContinuousControlEvidenceCollection } from "./contracts";
import { validateContinuousControlEvidenceCollection } from "./contracts";
import { evaluateContinuousControlEvidenceCollection } from "./policy";

export function assessRelease683(value: ContinuousControlEvidenceCollection) {
  const validationErrors = validateContinuousControlEvidenceCollection(value);
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
    decision: evaluateContinuousControlEvidenceCollection(value)
  };
}

import type { TrustCentreControlAndEvidenceCatalogue } from "./contracts";
import { validateTrustCentreControlAndEvidenceCatalogue } from "./contracts";
import { evaluateTrustCentreControlAndEvidenceCatalogue } from "./policy";

export function assessRelease851(value: TrustCentreControlAndEvidenceCatalogue) {
  const validationErrors = validateTrustCentreControlAndEvidenceCatalogue(value);
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
    decision: evaluateTrustCentreControlAndEvidenceCatalogue(value)
  };
}

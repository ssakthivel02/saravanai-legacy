import type { ReligiousAndCulturalHeritagePatternV2 } from "./contracts";
import { validateReligiousAndCulturalHeritagePatternV2 } from "./contracts";
import { evaluateReligiousAndCulturalHeritagePatternV2 } from "./policy";

export function assessRelease368(value: ReligiousAndCulturalHeritagePatternV2) {
  const validationErrors = validateReligiousAndCulturalHeritagePatternV2(value);
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
    decision: evaluateReligiousAndCulturalHeritagePatternV2(value)
  };
}

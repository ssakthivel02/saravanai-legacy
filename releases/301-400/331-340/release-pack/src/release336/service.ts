import type { GoldenPathComplianceScoring } from "./contracts";
import { validateGoldenPathComplianceScoring } from "./contracts";
import { evaluateGoldenPathComplianceScoring } from "./policy";

export function assessRelease336(value: GoldenPathComplianceScoring) {
  const validationErrors = validateGoldenPathComplianceScoring(value);
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
    decision: evaluateGoldenPathComplianceScoring(value)
  };
}

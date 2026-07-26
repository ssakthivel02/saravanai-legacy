import type { SustainabilityAndSocialImpactGate } from "./contracts";
import { validateSustainabilityAndSocialImpactGate } from "./contracts";
import { evaluateSustainabilityAndSocialImpactGate } from "./policy";

export function assessRelease470(value: SustainabilityAndSocialImpactGate) {
  const validationErrors = validateSustainabilityAndSocialImpactGate(value);
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
    decision: evaluateSustainabilityAndSocialImpactGate(value)
  };
}

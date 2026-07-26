import type { BuildReproducibilityAndProvenance } from "./contracts";
import { validateBuildReproducibilityAndProvenance } from "./contracts";
import { evaluateBuildReproducibilityAndProvenance } from "./policy";

export function assessRelease337(value: BuildReproducibilityAndProvenance) {
  const validationErrors = validateBuildReproducibilityAndProvenance(value);
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
    decision: evaluateBuildReproducibilityAndProvenance(value)
  };
}

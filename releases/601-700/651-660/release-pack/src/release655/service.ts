import type { BuildReproducibilityAndProvenanceV2 } from "./contracts";
import { validateBuildReproducibilityAndProvenanceV2 } from "./contracts";
import { evaluateBuildReproducibilityAndProvenanceV2 } from "./policy";

export function assessRelease655(value: BuildReproducibilityAndProvenanceV2) {
  const validationErrors = validateBuildReproducibilityAndProvenanceV2(value);
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
    decision: evaluateBuildReproducibilityAndProvenanceV2(value)
  };
}

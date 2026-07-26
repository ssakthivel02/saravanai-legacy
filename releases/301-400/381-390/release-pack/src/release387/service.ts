import type { SyntheticMediaProvenanceAndWatermarkReadiness } from "./contracts";
import { validateSyntheticMediaProvenanceAndWatermarkReadiness } from "./contracts";
import { evaluateSyntheticMediaProvenanceAndWatermarkReadiness } from "./policy";

export function assessRelease387(value: SyntheticMediaProvenanceAndWatermarkReadiness) {
  const validationErrors = validateSyntheticMediaProvenanceAndWatermarkReadiness(value);
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
    decision: evaluateSyntheticMediaProvenanceAndWatermarkReadiness(value)
  };
}

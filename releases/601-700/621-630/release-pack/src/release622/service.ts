import type { IngestionParsingAndNormalisationPipeline } from "./contracts";
import { validateIngestionParsingAndNormalisationPipeline } from "./contracts";
import { evaluateIngestionParsingAndNormalisationPipeline } from "./policy";

export function assessRelease622(value: IngestionParsingAndNormalisationPipeline) {
  const validationErrors = validateIngestionParsingAndNormalisationPipeline(value);
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
    decision: evaluateIngestionParsingAndNormalisationPipeline(value)
  };
}

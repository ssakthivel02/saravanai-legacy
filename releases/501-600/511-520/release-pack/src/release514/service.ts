import type { VideoGenerationAndEditingSafety } from "./contracts";
import { validateVideoGenerationAndEditingSafety } from "./contracts";
import { evaluateVideoGenerationAndEditingSafety } from "./policy";

export function assessRelease514(value: VideoGenerationAndEditingSafety) {
  const validationErrors = validateVideoGenerationAndEditingSafety(value);
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
    decision: evaluateVideoGenerationAndEditingSafety(value)
  };
}

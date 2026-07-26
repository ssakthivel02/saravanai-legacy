import type { ImageGenerationAndEditingGovernance } from "./contracts";
import { validateImageGenerationAndEditingGovernance } from "./contracts";
import { evaluateImageGenerationAndEditingGovernance } from "./policy";

export function assessRelease512(value: ImageGenerationAndEditingGovernance) {
  const validationErrors = validateImageGenerationAndEditingGovernance(value);
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
    decision: evaluateImageGenerationAndEditingGovernance(value)
  };
}

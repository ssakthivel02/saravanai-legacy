import type { ImagePromptAndEditSpecification } from "./contracts";
import { validateImagePromptAndEditSpecification } from "./contracts";
import { evaluateImagePromptAndEditSpecification } from "./policy";

export function assessRelease642(value: ImagePromptAndEditSpecification) {
  const validationErrors = validateImagePromptAndEditSpecification(value);
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
    decision: evaluateImagePromptAndEditSpecification(value)
  };
}

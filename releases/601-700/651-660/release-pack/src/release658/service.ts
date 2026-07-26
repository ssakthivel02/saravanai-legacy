import type { SecureReleaseArtefactRegistry } from "./contracts";
import { validateSecureReleaseArtefactRegistry } from "./contracts";
import { evaluateSecureReleaseArtefactRegistry } from "./policy";

export function assessRelease658(value: SecureReleaseArtefactRegistry) {
  const validationErrors = validateSecureReleaseArtefactRegistry(value);
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
    decision: evaluateSecureReleaseArtefactRegistry(value)
  };
}

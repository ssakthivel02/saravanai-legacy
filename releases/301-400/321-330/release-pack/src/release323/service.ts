import type { PostQuantumCryptographyReadiness } from "./contracts";
import { validatePostQuantumCryptographyReadiness } from "./contracts";
import { evaluatePostQuantumCryptographyReadiness } from "./policy";

export function assessRelease323(value: PostQuantumCryptographyReadiness) {
  const validationErrors = validatePostQuantumCryptographyReadiness(value);
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
    decision: evaluatePostQuantumCryptographyReadiness(value)
  };
}

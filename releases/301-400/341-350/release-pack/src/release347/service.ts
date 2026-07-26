import type { HomomorphicEncryptionReadiness } from "./contracts";
import { validateHomomorphicEncryptionReadiness } from "./contracts";
import { evaluateHomomorphicEncryptionReadiness } from "./policy";

export function assessRelease347(value: HomomorphicEncryptionReadiness) {
  const validationErrors = validateHomomorphicEncryptionReadiness(value);
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
    decision: evaluateHomomorphicEncryptionReadiness(value)
  };
}

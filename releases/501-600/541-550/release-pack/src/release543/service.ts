import type { PasswordlessAndPasskeyReadiness } from "./contracts";
import { validatePasswordlessAndPasskeyReadiness } from "./contracts";
import { evaluatePasswordlessAndPasskeyReadiness } from "./policy";

export function assessRelease543(value: PasswordlessAndPasskeyReadiness) {
  const validationErrors = validatePasswordlessAndPasskeyReadiness(value);
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
    decision: evaluatePasswordlessAndPasskeyReadiness(value)
  };
}

import type { ImmutableBackupVerificationV2 } from "./contracts";
import { validateImmutableBackupVerificationV2 } from "./contracts";
import { evaluateImmutableBackupVerificationV2 } from "./policy";

export function assessRelease533(value: ImmutableBackupVerificationV2) {
  const validationErrors = validateImmutableBackupVerificationV2(value);
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
    decision: evaluateImmutableBackupVerificationV2(value)
  };
}

import type { BackupImmutabilityAndCyberVault } from "./contracts";
import { validateBackupImmutabilityAndCyberVault } from "./contracts";
import { evaluateBackupImmutabilityAndCyberVault } from "./policy";

export function assessRelease375(value: BackupImmutabilityAndCyberVault) {
  const validationErrors = validateBackupImmutabilityAndCyberVault(value);
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
    decision: evaluateBackupImmutabilityAndCyberVault(value)
  };
}

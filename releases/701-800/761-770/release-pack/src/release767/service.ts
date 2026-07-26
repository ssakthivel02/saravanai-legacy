import type { StorageDataProtectionAndRecovery } from "./contracts";
import { validateStorageDataProtectionAndRecovery } from "./contracts";
import { evaluateStorageDataProtectionAndRecovery } from "./policy";

export function assessRelease767(value: StorageDataProtectionAndRecovery) {
  const validationErrors = validateStorageDataProtectionAndRecovery(value);
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
    decision: evaluateStorageDataProtectionAndRecovery(value)
  };
}

import type { DataPlatformRecoveryAndPortability } from "./contracts";
import { validateDataPlatformRecoveryAndPortability } from "./contracts";
import { evaluateDataPlatformRecoveryAndPortability } from "./policy";

export function assessRelease439(value: DataPlatformRecoveryAndPortability) {
  const validationErrors = validateDataPlatformRecoveryAndPortability(value);
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
    decision: evaluateDataPlatformRecoveryAndPortability(value)
  };
}

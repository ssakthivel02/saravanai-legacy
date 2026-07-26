import type { DataIntegrityAndReconciliationRecovery } from "./contracts";
import { validateDataIntegrityAndReconciliationRecovery } from "./contracts";
import { evaluateDataIntegrityAndReconciliationRecovery } from "./policy";

export function assessRelease536(value: DataIntegrityAndReconciliationRecovery) {
  const validationErrors = validateDataIntegrityAndReconciliationRecovery(value);
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
    decision: evaluateDataIntegrityAndReconciliationRecovery(value)
  };
}

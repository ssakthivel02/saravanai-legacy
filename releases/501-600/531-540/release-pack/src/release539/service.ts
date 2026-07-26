import type { RecoveryMetricsAndExecutiveReporting } from "./contracts";
import { validateRecoveryMetricsAndExecutiveReporting } from "./contracts";
import { evaluateRecoveryMetricsAndExecutiveReporting } from "./policy";

export function assessRelease539(value: RecoveryMetricsAndExecutiveReporting) {
  const validationErrors = validateRecoveryMetricsAndExecutiveReporting(value);
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
    decision: evaluateRecoveryMetricsAndExecutiveReporting(value)
  };
}

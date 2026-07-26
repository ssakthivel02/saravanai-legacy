import type { ComplianceObligationChangeMonitor } from "./contracts";
import { validateComplianceObligationChangeMonitor } from "./contracts";
import { evaluateComplianceObligationChangeMonitor } from "./policy";

export function assessRelease857(value: ComplianceObligationChangeMonitor) {
  const validationErrors = validateComplianceObligationChangeMonitor(value);
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
    decision: evaluateComplianceObligationChangeMonitor(value)
  };
}

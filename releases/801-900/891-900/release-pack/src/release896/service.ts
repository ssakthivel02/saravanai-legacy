import type { OperationalReadinessAndServiceAcceptanceV6 } from "./contracts";
import { validateOperationalReadinessAndServiceAcceptanceV6 } from "./contracts";
import { evaluateOperationalReadinessAndServiceAcceptanceV6 } from "./policy";

export function assessRelease896(value: OperationalReadinessAndServiceAcceptanceV6) {
  const validationErrors = validateOperationalReadinessAndServiceAcceptanceV6(value);
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
    decision: evaluateOperationalReadinessAndServiceAcceptanceV6(value)
  };
}

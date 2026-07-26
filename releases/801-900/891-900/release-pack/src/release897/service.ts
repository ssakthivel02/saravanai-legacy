import type { ControlledTenantPilotAndExitCriteria } from "./contracts";
import { validateControlledTenantPilotAndExitCriteria } from "./contracts";
import { evaluateControlledTenantPilotAndExitCriteria } from "./policy";

export function assessRelease897(value: ControlledTenantPilotAndExitCriteria) {
  const validationErrors = validateControlledTenantPilotAndExitCriteria(value);
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
    decision: evaluateControlledTenantPilotAndExitCriteria(value)
  };
}

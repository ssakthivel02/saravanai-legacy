import type { IndustrialChangeAndMaintenanceControl } from "./contracts";
import { validateIndustrialChangeAndMaintenanceControl } from "./contracts";
import { evaluateIndustrialChangeAndMaintenanceControl } from "./policy";

export function assessRelease757(value: IndustrialChangeAndMaintenanceControl) {
  const validationErrors = validateIndustrialChangeAndMaintenanceControl(value);
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
    decision: evaluateIndustrialChangeAndMaintenanceControl(value)
  };
}

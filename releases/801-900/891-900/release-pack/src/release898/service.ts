import type { ProductionChangeApprovalAndLaunchWindow } from "./contracts";
import { validateProductionChangeApprovalAndLaunchWindow } from "./contracts";
import { evaluateProductionChangeApprovalAndLaunchWindow } from "./policy";

export function assessRelease898(value: ProductionChangeApprovalAndLaunchWindow) {
  const validationErrors = validateProductionChangeApprovalAndLaunchWindow(value);
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
    decision: evaluateProductionChangeApprovalAndLaunchWindow(value)
  };
}

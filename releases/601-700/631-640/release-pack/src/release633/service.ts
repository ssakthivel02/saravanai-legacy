import type { TenantDataBoundaryEnforcementV2 } from "./contracts";
import { validateTenantDataBoundaryEnforcementV2 } from "./contracts";
import { evaluateTenantDataBoundaryEnforcementV2 } from "./policy";

export function assessRelease633(value: TenantDataBoundaryEnforcementV2) {
  const validationErrors = validateTenantDataBoundaryEnforcementV2(value);
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
    decision: evaluateTenantDataBoundaryEnforcementV2(value)
  };
}

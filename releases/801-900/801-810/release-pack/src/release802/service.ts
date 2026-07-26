import type { TenantBoundaryEnforcementMiddleware } from "./contracts";
import { validateTenantBoundaryEnforcementMiddleware } from "./contracts";
import { evaluateTenantBoundaryEnforcementMiddleware } from "./policy";

export function assessRelease802(value: TenantBoundaryEnforcementMiddleware) {
  const validationErrors = validateTenantBoundaryEnforcementMiddleware(value);
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
    decision: evaluateTenantBoundaryEnforcementMiddleware(value)
  };
}

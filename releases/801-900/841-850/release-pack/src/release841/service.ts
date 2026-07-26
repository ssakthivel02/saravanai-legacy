import type { CustomerWorkspaceTenantProvisioning } from "./contracts";
import { validateCustomerWorkspaceTenantProvisioning } from "./contracts";
import { evaluateCustomerWorkspaceTenantProvisioning } from "./policy";

export function assessRelease841(value: CustomerWorkspaceTenantProvisioning) {
  const validationErrors = validateCustomerWorkspaceTenantProvisioning(value);
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
    decision: evaluateCustomerWorkspaceTenantProvisioning(value)
  };
}

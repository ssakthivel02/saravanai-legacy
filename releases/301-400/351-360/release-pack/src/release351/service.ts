import type { EnterpriseCustomerWorkspaceV2 } from "./contracts";
import { validateEnterpriseCustomerWorkspaceV2 } from "./contracts";
import { evaluateEnterpriseCustomerWorkspaceV2 } from "./policy";

export function assessRelease351(value: EnterpriseCustomerWorkspaceV2) {
  const validationErrors = validateEnterpriseCustomerWorkspaceV2(value);
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
    decision: evaluateEnterpriseCustomerWorkspaceV2(value)
  };
}

import type { WorkspaceRoleAndDelegationRuntime } from "./contracts";
import { validateWorkspaceRoleAndDelegationRuntime } from "./contracts";
import { evaluateWorkspaceRoleAndDelegationRuntime } from "./policy";

export function assessRelease842(value: WorkspaceRoleAndDelegationRuntime) {
  const validationErrors = validateWorkspaceRoleAndDelegationRuntime(value);
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
    decision: evaluateWorkspaceRoleAndDelegationRuntime(value)
  };
}

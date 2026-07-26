import type { HumanApprovalInboxAndDecisionRuntime } from "./contracts";
import { validateHumanApprovalInboxAndDecisionRuntime } from "./contracts";
import { evaluateHumanApprovalInboxAndDecisionRuntime } from "./policy";

export function assessRelease824(value: HumanApprovalInboxAndDecisionRuntime) {
  const validationErrors = validateHumanApprovalInboxAndDecisionRuntime(value);
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
    decision: evaluateHumanApprovalInboxAndDecisionRuntime(value)
  };
}

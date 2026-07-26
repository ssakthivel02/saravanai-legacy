import type { HumanTaskInboxAndDelegation } from "./contracts";
import { validateHumanTaskInboxAndDelegation } from "./contracts";
import { evaluateHumanTaskInboxAndDelegation } from "./policy";

export function assessRelease673(value: HumanTaskInboxAndDelegation) {
  const validationErrors = validateHumanTaskInboxAndDelegation(value);
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
    decision: evaluateHumanTaskInboxAndDelegation(value)
  };
}

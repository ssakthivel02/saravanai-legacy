import type { ContentDistributionAndWithdrawal } from "./contracts";
import { validateContentDistributionAndWithdrawal } from "./contracts";
import { evaluateContentDistributionAndWithdrawal } from "./policy";

export function assessRelease649(value: ContentDistributionAndWithdrawal) {
  const validationErrors = validateContentDistributionAndWithdrawal(value);
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
    decision: evaluateContentDistributionAndWithdrawal(value)
  };
}

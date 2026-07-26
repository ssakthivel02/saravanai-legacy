import type { ContextWindowAndTokenBudgetGovernance } from "./contracts";
import { validateContextWindowAndTokenBudgetGovernance } from "./contracts";
import { evaluateContextWindowAndTokenBudgetGovernance } from "./policy";

export function assessRelease605(value: ContextWindowAndTokenBudgetGovernance) {
  const validationErrors = validateContextWindowAndTokenBudgetGovernance(value);
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
    decision: evaluateContextWindowAndTokenBudgetGovernance(value)
  };
}

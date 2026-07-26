import type { BudgetPlanningAndScenarioAnalysis } from "./contracts";
import { validateBudgetPlanningAndScenarioAnalysis } from "./contracts";
import { evaluateBudgetPlanningAndScenarioAnalysis } from "./policy";

export function assessRelease572(value: BudgetPlanningAndScenarioAnalysis) {
  const validationErrors = validateBudgetPlanningAndScenarioAnalysis(value);
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
    decision: evaluateBudgetPlanningAndScenarioAnalysis(value)
  };
}

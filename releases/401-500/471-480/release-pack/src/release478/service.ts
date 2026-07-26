import type { TechnicalDebtAndRefactoringIntelligence } from "./contracts";
import { validateTechnicalDebtAndRefactoringIntelligence } from "./contracts";
import { evaluateTechnicalDebtAndRefactoringIntelligence } from "./policy";

export function assessRelease478(value: TechnicalDebtAndRefactoringIntelligence) {
  const validationErrors = validateTechnicalDebtAndRefactoringIntelligence(value);
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
    decision: evaluateTechnicalDebtAndRefactoringIntelligence(value)
  };
}

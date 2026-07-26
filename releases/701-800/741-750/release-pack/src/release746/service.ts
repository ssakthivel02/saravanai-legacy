import type { CareerProfileResumeAndPortfolioComposer } from "./contracts";
import { validateCareerProfileResumeAndPortfolioComposer } from "./contracts";
import { evaluateCareerProfileResumeAndPortfolioComposer } from "./policy";

export function assessRelease746(value: CareerProfileResumeAndPortfolioComposer) {
  const validationErrors = validateCareerProfileResumeAndPortfolioComposer(value);
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
    decision: evaluateCareerProfileResumeAndPortfolioComposer(value)
  };
}

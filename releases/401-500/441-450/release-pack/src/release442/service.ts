import type { ApplicationPortfolioRationalisation } from "./contracts";
import { validateApplicationPortfolioRationalisation } from "./contracts";
import { evaluateApplicationPortfolioRationalisation } from "./policy";

export function assessRelease442(value: ApplicationPortfolioRationalisation) {
  const validationErrors = validateApplicationPortfolioRationalisation(value);
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
    decision: evaluateApplicationPortfolioRationalisation(value)
  };
}

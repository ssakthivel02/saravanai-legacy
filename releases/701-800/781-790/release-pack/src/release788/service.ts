import type { BenefitsOutcomesAndValueRealisation } from "./contracts";
import { validateBenefitsOutcomesAndValueRealisation } from "./contracts";
import { evaluateBenefitsOutcomesAndValueRealisation } from "./policy";

export function assessRelease788(value: BenefitsOutcomesAndValueRealisation) {
  const validationErrors = validateBenefitsOutcomesAndValueRealisation(value);
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
    decision: evaluateBenefitsOutcomesAndValueRealisation(value)
  };
}

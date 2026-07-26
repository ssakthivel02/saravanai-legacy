import type { FinanceAndProcurementIntegration } from "./contracts";
import { validateFinanceAndProcurementIntegration } from "./contracts";
import { evaluateFinanceAndProcurementIntegration } from "./policy";

export function assessRelease446(value: FinanceAndProcurementIntegration) {
  const validationErrors = validateFinanceAndProcurementIntegration(value);
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
    decision: evaluateFinanceAndProcurementIntegration(value)
  };
}

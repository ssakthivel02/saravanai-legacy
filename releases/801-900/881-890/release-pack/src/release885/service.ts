import type { FinOpsAllocationAndShowbackWithoutBilling } from "./contracts";
import { validateFinOpsAllocationAndShowbackWithoutBilling } from "./contracts";
import { evaluateFinOpsAllocationAndShowbackWithoutBilling } from "./policy";

export function assessRelease885(value: FinOpsAllocationAndShowbackWithoutBilling) {
  const validationErrors = validateFinOpsAllocationAndShowbackWithoutBilling(value);
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
    decision: evaluateFinOpsAllocationAndShowbackWithoutBilling(value)
  };
}

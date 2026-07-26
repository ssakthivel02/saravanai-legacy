import type { FinOpsAllocationAndShowbackV2 } from "./contracts";
import { validateFinOpsAllocationAndShowbackV2 } from "./contracts";
import { evaluateFinOpsAllocationAndShowbackV2 } from "./policy";

export function assessRelease573(value: FinOpsAllocationAndShowbackV2) {
  const validationErrors = validateFinOpsAllocationAndShowbackV2(value);
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
    decision: evaluateFinOpsAllocationAndShowbackV2(value)
  };
}

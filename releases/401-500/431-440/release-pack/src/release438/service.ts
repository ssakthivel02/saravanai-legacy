import type { DataPlatformCostAndCapacity } from "./contracts";
import { validateDataPlatformCostAndCapacity } from "./contracts";
import { evaluateDataPlatformCostAndCapacity } from "./policy";

export function assessRelease438(value: DataPlatformCostAndCapacity) {
  const validationErrors = validateDataPlatformCostAndCapacity(value);
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
    decision: evaluateDataPlatformCostAndCapacity(value)
  };
}

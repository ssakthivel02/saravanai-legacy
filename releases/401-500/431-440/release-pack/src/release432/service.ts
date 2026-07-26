import type { DataIngestionAndChangeDataCapture } from "./contracts";
import { validateDataIngestionAndChangeDataCapture } from "./contracts";
import { evaluateDataIngestionAndChangeDataCapture } from "./policy";

export function assessRelease432(value: DataIngestionAndChangeDataCapture) {
  const validationErrors = validateDataIngestionAndChangeDataCapture(value);
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
    decision: evaluateDataIngestionAndChangeDataCapture(value)
  };
}

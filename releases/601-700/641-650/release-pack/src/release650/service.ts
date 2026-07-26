import type { MultimodalContentOperationsGate } from "./contracts";
import { validateMultimodalContentOperationsGate } from "./contracts";
import { evaluateMultimodalContentOperationsGate } from "./policy";

export function assessRelease650(value: MultimodalContentOperationsGate) {
  const validationErrors = validateMultimodalContentOperationsGate(value);
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
    decision: evaluateMultimodalContentOperationsGate(value)
  };
}

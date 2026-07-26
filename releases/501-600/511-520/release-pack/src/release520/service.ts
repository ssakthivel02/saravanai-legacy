import type { MultimodalMediaAssuranceGate } from "./contracts";
import { validateMultimodalMediaAssuranceGate } from "./contracts";
import { evaluateMultimodalMediaAssuranceGate } from "./policy";

export function assessRelease520(value: MultimodalMediaAssuranceGate) {
  const validationErrors = validateMultimodalMediaAssuranceGate(value);
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
    decision: evaluateMultimodalMediaAssuranceGate(value)
  };
}

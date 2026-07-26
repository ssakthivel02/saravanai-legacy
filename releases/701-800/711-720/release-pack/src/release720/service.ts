import type { DeepResearchAssuranceGate } from "./contracts";
import { validateDeepResearchAssuranceGate } from "./contracts";
import { evaluateDeepResearchAssuranceGate } from "./policy";

export function assessRelease720(value: DeepResearchAssuranceGate) {
  const validationErrors = validateDeepResearchAssuranceGate(value);
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
    decision: evaluateDeepResearchAssuranceGate(value)
  };
}

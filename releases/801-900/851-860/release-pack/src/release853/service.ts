import type { ContinuousControlEvidenceCollectorRuntime } from "./contracts";
import { validateContinuousControlEvidenceCollectorRuntime } from "./contracts";
import { evaluateContinuousControlEvidenceCollectorRuntime } from "./policy";

export function assessRelease853(value: ContinuousControlEvidenceCollectorRuntime) {
  const validationErrors = validateContinuousControlEvidenceCollectorRuntime(value);
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
    decision: evaluateContinuousControlEvidenceCollectorRuntime(value)
  };
}

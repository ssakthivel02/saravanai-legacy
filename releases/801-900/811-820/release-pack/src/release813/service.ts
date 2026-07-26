import type { FreeFirstModelRoutingRuntime } from "./contracts";
import { validateFreeFirstModelRoutingRuntime } from "./contracts";
import { evaluateFreeFirstModelRoutingRuntime } from "./policy";

export function assessRelease813(value: FreeFirstModelRoutingRuntime) {
  const validationErrors = validateFreeFirstModelRoutingRuntime(value);
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
    decision: evaluateFreeFirstModelRoutingRuntime(value)
  };
}

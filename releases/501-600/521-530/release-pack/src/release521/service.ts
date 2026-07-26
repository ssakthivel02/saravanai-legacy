import type { APIProductLifecycleV2 } from "./contracts";
import { validateAPIProductLifecycleV2 } from "./contracts";
import { evaluateAPIProductLifecycleV2 } from "./policy";

export function assessRelease521(value: APIProductLifecycleV2) {
  const validationErrors = validateAPIProductLifecycleV2(value);
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
    decision: evaluateAPIProductLifecycleV2(value)
  };
}

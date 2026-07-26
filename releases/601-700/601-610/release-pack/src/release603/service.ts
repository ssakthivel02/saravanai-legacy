import type { DynamicModelRoutingControl } from "./contracts";
import { validateDynamicModelRoutingControl } from "./contracts";
import { evaluateDynamicModelRoutingControl } from "./policy";

export function assessRelease603(value: DynamicModelRoutingControl) {
  const validationErrors = validateDynamicModelRoutingControl(value);
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
    decision: evaluateDynamicModelRoutingControl(value)
  };
}

import type { RegionalRoutingAndProcessingControl } from "./contracts";
import { validateRegionalRoutingAndProcessingControl } from "./contracts";
import { evaluateRegionalRoutingAndProcessingControl } from "./policy";

export function assessRelease634(value: RegionalRoutingAndProcessingControl) {
  const validationErrors = validateRegionalRoutingAndProcessingControl(value);
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
    decision: evaluateRegionalRoutingAndProcessingControl(value)
  };
}

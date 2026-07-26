import type { RegionalFeatureAndDataRoutingRuntime } from "./contracts";
import { validateRegionalFeatureAndDataRoutingRuntime } from "./contracts";
import { evaluateRegionalFeatureAndDataRoutingRuntime } from "./policy";

export function assessRelease862(value: RegionalFeatureAndDataRoutingRuntime) {
  const validationErrors = validateRegionalFeatureAndDataRoutingRuntime(value);
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
    decision: evaluateRegionalFeatureAndDataRoutingRuntime(value)
  };
}

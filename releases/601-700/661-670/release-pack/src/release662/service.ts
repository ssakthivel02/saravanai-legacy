import type { ServiceDependencyAndCriticalityMapV2 } from "./contracts";
import { validateServiceDependencyAndCriticalityMapV2 } from "./contracts";
import { evaluateServiceDependencyAndCriticalityMapV2 } from "./policy";

export function assessRelease662(value: ServiceDependencyAndCriticalityMapV2) {
  const validationErrors = validateServiceDependencyAndCriticalityMapV2(value);
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
    decision: evaluateServiceDependencyAndCriticalityMapV2(value)
  };
}

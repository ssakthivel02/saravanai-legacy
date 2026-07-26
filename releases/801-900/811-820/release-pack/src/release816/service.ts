import type { ProviderHealthCircuitBreakerAndFallback } from "./contracts";
import { validateProviderHealthCircuitBreakerAndFallback } from "./contracts";
import { evaluateProviderHealthCircuitBreakerAndFallback } from "./policy";

export function assessRelease816(value: ProviderHealthCircuitBreakerAndFallback) {
  const validationErrors = validateProviderHealthCircuitBreakerAndFallback(value);
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
    decision: evaluateProviderHealthCircuitBreakerAndFallback(value)
  };
}

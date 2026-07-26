import type { LocaleAndMarketReadinessRegistry } from "./contracts";
import { validateLocaleAndMarketReadinessRegistry } from "./contracts";
import { evaluateLocaleAndMarketReadinessRegistry } from "./policy";

export function assessRelease581(value: LocaleAndMarketReadinessRegistry) {
  const validationErrors = validateLocaleAndMarketReadinessRegistry(value);
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
    decision: evaluateLocaleAndMarketReadinessRegistry(value)
  };
}

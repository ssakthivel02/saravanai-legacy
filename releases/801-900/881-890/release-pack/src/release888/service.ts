import type { ProviderContractExitAndPortabilityReadiness } from "./contracts";
import { validateProviderContractExitAndPortabilityReadiness } from "./contracts";
import { evaluateProviderContractExitAndPortabilityReadiness } from "./policy";

export function assessRelease888(value: ProviderContractExitAndPortabilityReadiness) {
  const validationErrors = validateProviderContractExitAndPortabilityReadiness(value);
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
    decision: evaluateProviderContractExitAndPortabilityReadiness(value)
  };
}

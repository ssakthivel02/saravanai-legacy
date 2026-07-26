import type { EcosystemCommercialReadinessWithoutBilling } from "./contracts";
import { validateEcosystemCommercialReadinessWithoutBilling } from "./contracts";
import { evaluateEcosystemCommercialReadinessWithoutBilling } from "./policy";

export function assessRelease359(value: EcosystemCommercialReadinessWithoutBilling) {
  const validationErrors = validateEcosystemCommercialReadinessWithoutBilling(value);
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
    decision: evaluateEcosystemCommercialReadinessWithoutBilling(value)
  };
}

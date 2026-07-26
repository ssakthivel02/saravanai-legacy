import type { CommercialServiceDefinitionWithoutBillingV3 } from "./contracts";
import { validateCommercialServiceDefinitionWithoutBillingV3 } from "./contracts";
import { evaluateCommercialServiceDefinitionWithoutBillingV3 } from "./policy";

export function assessRelease798(value: CommercialServiceDefinitionWithoutBillingV3) {
  const validationErrors = validateCommercialServiceDefinitionWithoutBillingV3(value);
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
    decision: evaluateCommercialServiceDefinitionWithoutBillingV3(value)
  };
}

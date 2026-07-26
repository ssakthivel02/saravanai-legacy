import type { EnterpriseEconomicsAssuranceGate } from "./contracts";
import { validateEnterpriseEconomicsAssuranceGate } from "./contracts";
import { evaluateEnterpriseEconomicsAssuranceGate } from "./policy";

export function assessRelease580(value: EnterpriseEconomicsAssuranceGate) {
  const validationErrors = validateEnterpriseEconomicsAssuranceGate(value);
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
    decision: evaluateEnterpriseEconomicsAssuranceGate(value)
  };
}

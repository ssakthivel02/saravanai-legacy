import type { EnterpriseAIOperatingSystemAssuranceGate } from "./contracts";
import { validateEnterpriseAIOperatingSystemAssuranceGate } from "./contracts";
import { evaluateEnterpriseAIOperatingSystemAssuranceGate } from "./policy";

export function assessRelease410(value: EnterpriseAIOperatingSystemAssuranceGate) {
  const validationErrors = validateEnterpriseAIOperatingSystemAssuranceGate(value);
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
    decision: evaluateEnterpriseAIOperatingSystemAssuranceGate(value)
  };
}

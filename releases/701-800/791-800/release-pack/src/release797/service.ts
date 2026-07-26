import type { CustomerPilotAndAdoptionEvidenceV2 } from "./contracts";
import { validateCustomerPilotAndAdoptionEvidenceV2 } from "./contracts";
import { evaluateCustomerPilotAndAdoptionEvidenceV2 } from "./policy";

export function assessRelease797(value: CustomerPilotAndAdoptionEvidenceV2) {
  const validationErrors = validateCustomerPilotAndAdoptionEvidenceV2(value);
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
    decision: evaluateCustomerPilotAndAdoptionEvidenceV2(value)
  };
}

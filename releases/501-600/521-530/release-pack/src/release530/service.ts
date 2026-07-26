import type { APIAndIntegrationFabricAssuranceGate } from "./contracts";
import { validateAPIAndIntegrationFabricAssuranceGate } from "./contracts";
import { evaluateAPIAndIntegrationFabricAssuranceGate } from "./policy";

export function assessRelease530(value: APIAndIntegrationFabricAssuranceGate) {
  const validationErrors = validateAPIAndIntegrationFabricAssuranceGate(value);
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
    decision: evaluateAPIAndIntegrationFabricAssuranceGate(value)
  };
}

import type { DataProductsAndSemanticLayerAssuranceGate } from "./contracts";
import { validateDataProductsAndSemanticLayerAssuranceGate } from "./contracts";
import { evaluateDataProductsAndSemanticLayerAssuranceGate } from "./policy";

export function assessRelease780(value: DataProductsAndSemanticLayerAssuranceGate) {
  const validationErrors = validateDataProductsAndSemanticLayerAssuranceGate(value);
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
    decision: evaluateDataProductsAndSemanticLayerAssuranceGate(value)
  };
}

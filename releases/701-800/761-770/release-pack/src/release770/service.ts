import type { HybridCloudAndInfrastructureAssuranceGate } from "./contracts";
import { validateHybridCloudAndInfrastructureAssuranceGate } from "./contracts";
import { evaluateHybridCloudAndInfrastructureAssuranceGate } from "./policy";

export function assessRelease770(value: HybridCloudAndInfrastructureAssuranceGate) {
  const validationErrors = validateHybridCloudAndInfrastructureAssuranceGate(value);
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
    decision: evaluateHybridCloudAndInfrastructureAssuranceGate(value)
  };
}

import type { EnterpriseArchitectureRepositoryV3 } from "./contracts";
import { validateEnterpriseArchitectureRepositoryV3 } from "./contracts";
import { evaluateEnterpriseArchitectureRepositoryV3 } from "./policy";

export function assessRelease592(value: EnterpriseArchitectureRepositoryV3) {
  const validationErrors = validateEnterpriseArchitectureRepositoryV3(value);
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
    decision: evaluateEnterpriseArchitectureRepositoryV3(value)
  };
}

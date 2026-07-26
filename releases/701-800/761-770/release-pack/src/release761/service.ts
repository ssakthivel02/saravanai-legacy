import type { HybridInfrastructureServiceCatalogue } from "./contracts";
import { validateHybridInfrastructureServiceCatalogue } from "./contracts";
import { evaluateHybridInfrastructureServiceCatalogue } from "./policy";

export function assessRelease761(value: HybridInfrastructureServiceCatalogue) {
  const validationErrors = validateHybridInfrastructureServiceCatalogue(value);
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
    decision: evaluateHybridInfrastructureServiceCatalogue(value)
  };
}

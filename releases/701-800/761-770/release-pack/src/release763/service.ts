import type { InfrastructureAsCodeModuleRegistry } from "./contracts";
import { validateInfrastructureAsCodeModuleRegistry } from "./contracts";
import { evaluateInfrastructureAsCodeModuleRegistry } from "./policy";

export function assessRelease763(value: InfrastructureAsCodeModuleRegistry) {
  const validationErrors = validateInfrastructureAsCodeModuleRegistry(value);
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
    decision: evaluateInfrastructureAsCodeModuleRegistry(value)
  };
}

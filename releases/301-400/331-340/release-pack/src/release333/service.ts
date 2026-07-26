import type { InfrastructureModuleRegistry } from "./contracts";
import { validateInfrastructureModuleRegistry } from "./contracts";
import { evaluateInfrastructureModuleRegistry } from "./policy";

export function assessRelease333(value: InfrastructureModuleRegistry) {
  const validationErrors = validateInfrastructureModuleRegistry(value);
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
    decision: evaluateInfrastructureModuleRegistry(value)
  };
}

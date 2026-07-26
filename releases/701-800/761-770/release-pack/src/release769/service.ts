import type { InfrastructureChangeAndMigrationOrchestration } from "./contracts";
import { validateInfrastructureChangeAndMigrationOrchestration } from "./contracts";
import { evaluateInfrastructureChangeAndMigrationOrchestration } from "./policy";

export function assessRelease769(value: InfrastructureChangeAndMigrationOrchestration) {
  const validationErrors = validateInfrastructureChangeAndMigrationOrchestration(value);
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
    decision: evaluateInfrastructureChangeAndMigrationOrchestration(value)
  };
}

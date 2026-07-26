import type { ProductionDataAndMigrationReadinessV5 } from "./contracts";
import { validateProductionDataAndMigrationReadinessV5 } from "./contracts";
import { evaluateProductionDataAndMigrationReadinessV5 } from "./policy";

export function assessRelease794(value: ProductionDataAndMigrationReadinessV5) {
  const validationErrors = validateProductionDataAndMigrationReadinessV5(value);
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
    decision: evaluateProductionDataAndMigrationReadinessV5(value)
  };
}

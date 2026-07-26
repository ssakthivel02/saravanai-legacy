import type { ProductionMigrationAndCutoverControlV4 } from "./contracts";
import { validateProductionMigrationAndCutoverControlV4 } from "./contracts";
import { evaluateProductionMigrationAndCutoverControlV4 } from "./policy";

export function assessRelease694(value: ProductionMigrationAndCutoverControlV4) {
  const validationErrors = validateProductionMigrationAndCutoverControlV4(value);
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
    decision: evaluateProductionMigrationAndCutoverControlV4(value)
  };
}

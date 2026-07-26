import type { MigrationAndDecommissionFactoryV3 } from "./contracts";
import { validateMigrationAndDecommissionFactoryV3 } from "./contracts";
import { evaluateMigrationAndDecommissionFactoryV3 } from "./policy";

export function assessRelease595(value: MigrationAndDecommissionFactoryV3) {
  const validationErrors = validateMigrationAndDecommissionFactoryV3(value);
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
    decision: evaluateMigrationAndDecommissionFactoryV3(value)
  };
}

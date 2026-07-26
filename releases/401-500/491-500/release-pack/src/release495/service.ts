import type { CustomerMigrationFactoryV2 } from "./contracts";
import { validateCustomerMigrationFactoryV2 } from "./contracts";
import { evaluateCustomerMigrationFactoryV2 } from "./policy";

export function assessRelease495(value: CustomerMigrationFactoryV2) {
  const validationErrors = validateCustomerMigrationFactoryV2(value);
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
    decision: evaluateCustomerMigrationFactoryV2(value)
  };
}

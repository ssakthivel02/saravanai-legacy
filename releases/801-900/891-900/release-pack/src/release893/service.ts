import type { D1MigrationImplementationAndRehearsalV6 } from "./contracts";
import { validateD1MigrationImplementationAndRehearsalV6 } from "./contracts";
import { evaluateD1MigrationImplementationAndRehearsalV6 } from "./policy";

export function assessRelease893(value: D1MigrationImplementationAndRehearsalV6) {
  const validationErrors = validateD1MigrationImplementationAndRehearsalV6(value);
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
    decision: evaluateD1MigrationImplementationAndRehearsalV6(value)
  };
}

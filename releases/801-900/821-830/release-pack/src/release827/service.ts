import type { CompensatingActionAndRollbackExecutor } from "./contracts";
import { validateCompensatingActionAndRollbackExecutor } from "./contracts";
import { evaluateCompensatingActionAndRollbackExecutor } from "./policy";

export function assessRelease827(value: CompensatingActionAndRollbackExecutor) {
  const validationErrors = validateCompensatingActionAndRollbackExecutor(value);
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
    decision: evaluateCompensatingActionAndRollbackExecutor(value)
  };
}

import type { EnterpriseStrategyAndObjectiveRegistry } from "./contracts";
import { validateEnterpriseStrategyAndObjectiveRegistry } from "./contracts";
import { evaluateEnterpriseStrategyAndObjectiveRegistry } from "./policy";

export function assessRelease781(value: EnterpriseStrategyAndObjectiveRegistry) {
  const validationErrors = validateEnterpriseStrategyAndObjectiveRegistry(value);
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
    decision: evaluateEnterpriseStrategyAndObjectiveRegistry(value)
  };
}

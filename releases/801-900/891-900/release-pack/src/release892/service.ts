import type { ProductionWorkerIntegrationPlanV8 } from "./contracts";
import { validateProductionWorkerIntegrationPlanV8 } from "./contracts";
import { evaluateProductionWorkerIntegrationPlanV8 } from "./policy";

export function assessRelease892(value: ProductionWorkerIntegrationPlanV8) {
  const validationErrors = validateProductionWorkerIntegrationPlanV8(value);
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
    decision: evaluateProductionWorkerIntegrationPlanV8(value)
  };
}

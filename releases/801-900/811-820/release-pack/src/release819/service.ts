import type { AIGatewayOperationalDashboardContract } from "./contracts";
import { validateAIGatewayOperationalDashboardContract } from "./contracts";
import { evaluateAIGatewayOperationalDashboardContract } from "./policy";

export function assessRelease819(value: AIGatewayOperationalDashboardContract) {
  const validationErrors = validateAIGatewayOperationalDashboardContract(value);
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
    decision: evaluateAIGatewayOperationalDashboardContract(value)
  };
}

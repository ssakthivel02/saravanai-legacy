import type { EnterpriseEventAndAPIIntegrationHub } from "./contracts";
import { validateEnterpriseEventAndAPIIntegrationHub } from "./contracts";
import { evaluateEnterpriseEventAndAPIIntegrationHub } from "./policy";

export function assessRelease447(value: EnterpriseEventAndAPIIntegrationHub) {
  const validationErrors = validateEnterpriseEventAndAPIIntegrationHub(value);
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
    decision: evaluateEnterpriseEventAndAPIIntegrationHub(value)
  };
}

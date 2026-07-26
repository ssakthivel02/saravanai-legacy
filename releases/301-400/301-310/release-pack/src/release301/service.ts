import type { EnterpriseDigitalTwinRegistry } from "./contracts";
import { validateEnterpriseDigitalTwinRegistry } from "./contracts";
import { evaluateEnterpriseDigitalTwinRegistry } from "./policy";

export function assessRelease301(value: EnterpriseDigitalTwinRegistry) {
  const validationErrors = validateEnterpriseDigitalTwinRegistry(value);
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
    decision: evaluateEnterpriseDigitalTwinRegistry(value)
  };
}

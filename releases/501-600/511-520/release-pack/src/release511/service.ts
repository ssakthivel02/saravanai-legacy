import type { EnterpriseDigitalAssetRegistry } from "./contracts";
import { validateEnterpriseDigitalAssetRegistry } from "./contracts";
import { evaluateEnterpriseDigitalAssetRegistry } from "./policy";

export function assessRelease511(value: EnterpriseDigitalAssetRegistry) {
  const validationErrors = validateEnterpriseDigitalAssetRegistry(value);
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
    decision: evaluateEnterpriseDigitalAssetRegistry(value)
  };
}

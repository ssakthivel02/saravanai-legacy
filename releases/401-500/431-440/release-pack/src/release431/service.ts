import type { EnterpriseLakehouseDomainRegistry } from "./contracts";
import { validateEnterpriseLakehouseDomainRegistry } from "./contracts";
import { evaluateEnterpriseLakehouseDomainRegistry } from "./policy";

export function assessRelease431(value: EnterpriseLakehouseDomainRegistry) {
  const validationErrors = validateEnterpriseLakehouseDomainRegistry(value);
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
    decision: evaluateEnterpriseLakehouseDomainRegistry(value)
  };
}

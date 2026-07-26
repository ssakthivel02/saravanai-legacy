import type { SupplierAssuranceAndDependencyRegister } from "./contracts";
import { validateSupplierAssuranceAndDependencyRegister } from "./contracts";
import { evaluateSupplierAssuranceAndDependencyRegister } from "./policy";

export function assessRelease856(value: SupplierAssuranceAndDependencyRegister) {
  const validationErrors = validateSupplierAssuranceAndDependencyRegister(value);
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
    decision: evaluateSupplierAssuranceAndDependencyRegister(value)
  };
}

import type { VendorCostAndContractOptimisation } from "./contracts";
import { validateVendorCostAndContractOptimisation } from "./contracts";
import { evaluateVendorCostAndContractOptimisation } from "./policy";

export function assessRelease576(value: VendorCostAndContractOptimisation) {
  const validationErrors = validateVendorCostAndContractOptimisation(value);
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
    decision: evaluateVendorCostAndContractOptimisation(value)
  };
}

import type { CryptographicAssetInventory } from "./contracts";
import { validateCryptographicAssetInventory } from "./contracts";
import { evaluateCryptographicAssetInventory } from "./policy";

export function assessRelease321(value: CryptographicAssetInventory) {
  const validationErrors = validateCryptographicAssetInventory(value);
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
    decision: evaluateCryptographicAssetInventory(value)
  };
}

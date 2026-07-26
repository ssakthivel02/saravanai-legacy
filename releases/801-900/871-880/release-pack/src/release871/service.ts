import type { DigitalTwinAssetAndModelRegistry } from "./contracts";
import { validateDigitalTwinAssetAndModelRegistry } from "./contracts";
import { evaluateDigitalTwinAssetAndModelRegistry } from "./policy";

export function assessRelease871(value: DigitalTwinAssetAndModelRegistry) {
  const validationErrors = validateDigitalTwinAssetAndModelRegistry(value);
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
    decision: evaluateDigitalTwinAssetAndModelRegistry(value)
  };
}

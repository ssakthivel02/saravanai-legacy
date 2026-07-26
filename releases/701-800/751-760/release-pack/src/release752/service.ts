import type { OTNetworkZoneAndConduitModel } from "./contracts";
import { validateOTNetworkZoneAndConduitModel } from "./contracts";
import { evaluateOTNetworkZoneAndConduitModel } from "./policy";

export function assessRelease752(value: OTNetworkZoneAndConduitModel) {
  const validationErrors = validateOTNetworkZoneAndConduitModel(value);
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
    decision: evaluateOTNetworkZoneAndConduitModel(value)
  };
}

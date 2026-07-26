import type { DeviceAIPolicyAndPosture } from "./contracts";
import { validateDeviceAIPolicyAndPosture } from "./contracts";
import { evaluateDeviceAIPolicyAndPosture } from "./policy";

export function assessRelease414(value: DeviceAIPolicyAndPosture) {
  const validationErrors = validateDeviceAIPolicyAndPosture(value);
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
    decision: evaluateDeviceAIPolicyAndPosture(value)
  };
}

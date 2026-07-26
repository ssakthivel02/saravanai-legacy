import type { IoTDeviceIdentityAndLifecycle } from "./contracts";
import { validateIoTDeviceIdentityAndLifecycle } from "./contracts";
import { evaluateIoTDeviceIdentityAndLifecycle } from "./policy";

export function assessRelease754(value: IoTDeviceIdentityAndLifecycle) {
  const validationErrors = validateIoTDeviceIdentityAndLifecycle(value);
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
    decision: evaluateIoTDeviceIdentityAndLifecycle(value)
  };
}

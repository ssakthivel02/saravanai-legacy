import type { NotificationPreferenceAndDeliveryRuntime } from "./contracts";
import { validateNotificationPreferenceAndDeliveryRuntime } from "./contracts";
import { evaluateNotificationPreferenceAndDeliveryRuntime } from "./policy";

export function assessRelease846(value: NotificationPreferenceAndDeliveryRuntime) {
  const validationErrors = validateNotificationPreferenceAndDeliveryRuntime(value);
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
    decision: evaluateNotificationPreferenceAndDeliveryRuntime(value)
  };
}

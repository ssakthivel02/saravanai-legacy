import type { WebhookDeliveryAndReplayGovernance } from "./contracts";
import { validateWebhookDeliveryAndReplayGovernance } from "./contracts";
import { evaluateWebhookDeliveryAndReplayGovernance } from "./policy";

export function assessRelease523(value: WebhookDeliveryAndReplayGovernance) {
  const validationErrors = validateWebhookDeliveryAndReplayGovernance(value);
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
    decision: evaluateWebhookDeliveryAndReplayGovernance(value)
  };
}

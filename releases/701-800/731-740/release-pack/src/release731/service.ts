import type { EnterpriseCommunicationCampaignRegistry } from "./contracts";
import { validateEnterpriseCommunicationCampaignRegistry } from "./contracts";
import { evaluateEnterpriseCommunicationCampaignRegistry } from "./policy";

export function assessRelease731(value: EnterpriseCommunicationCampaignRegistry) {
  const validationErrors = validateEnterpriseCommunicationCampaignRegistry(value);
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
    decision: evaluateEnterpriseCommunicationCampaignRegistry(value)
  };
}

import type { AdversarialRedTeamCampaignManagement } from "./contracts";
import { validateAdversarialRedTeamCampaignManagement } from "./contracts";
import { evaluateAdversarialRedTeamCampaignManagement } from "./policy";

export function assessRelease707(value: AdversarialRedTeamCampaignManagement) {
  const validationErrors = validateAdversarialRedTeamCampaignManagement(value);
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
    decision: evaluateAdversarialRedTeamCampaignManagement(value)
  };
}

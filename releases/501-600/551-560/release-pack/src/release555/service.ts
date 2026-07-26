import type { EnterpriseSearchAndKnowledgeAssistance } from "./contracts";
import { validateEnterpriseSearchAndKnowledgeAssistance } from "./contracts";
import { evaluateEnterpriseSearchAndKnowledgeAssistance } from "./policy";

export function assessRelease555(value: EnterpriseSearchAndKnowledgeAssistance) {
  const validationErrors = validateEnterpriseSearchAndKnowledgeAssistance(value);
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
    decision: evaluateEnterpriseSearchAndKnowledgeAssistance(value)
  };
}

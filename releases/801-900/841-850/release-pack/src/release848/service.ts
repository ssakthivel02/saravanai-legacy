import type { WorkspaceSearchAndKnowledgeAssistance } from "./contracts";
import { validateWorkspaceSearchAndKnowledgeAssistance } from "./contracts";
import { evaluateWorkspaceSearchAndKnowledgeAssistance } from "./policy";

export function assessRelease848(value: WorkspaceSearchAndKnowledgeAssistance) {
  const validationErrors = validateWorkspaceSearchAndKnowledgeAssistance(value);
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
    decision: evaluateWorkspaceSearchAndKnowledgeAssistance(value)
  };
}

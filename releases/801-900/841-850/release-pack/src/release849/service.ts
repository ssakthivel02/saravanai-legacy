import type { WorkspaceExportDeletionAndPortability } from "./contracts";
import { validateWorkspaceExportDeletionAndPortability } from "./contracts";
import { evaluateWorkspaceExportDeletionAndPortability } from "./policy";

export function assessRelease849(value: WorkspaceExportDeletionAndPortability) {
  const validationErrors = validateWorkspaceExportDeletionAndPortability(value);
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
    decision: evaluateWorkspaceExportDeletionAndPortability(value)
  };
}

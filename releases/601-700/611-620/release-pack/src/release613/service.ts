import type { ToolCatalogueAndCapabilityManifest } from "./contracts";
import { validateToolCatalogueAndCapabilityManifest } from "./contracts";
import { evaluateToolCatalogueAndCapabilityManifest } from "./policy";

export function assessRelease613(value: ToolCatalogueAndCapabilityManifest) {
  const validationErrors = validateToolCatalogueAndCapabilityManifest(value);
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
    decision: evaluateToolCatalogueAndCapabilityManifest(value)
  };
}

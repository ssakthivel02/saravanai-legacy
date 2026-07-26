import type { SkillsTaxonomyAndRoleMapping } from "./contracts";
import { validateSkillsTaxonomyAndRoleMapping } from "./contracts";
import { evaluateSkillsTaxonomyAndRoleMapping } from "./policy";

export function assessRelease748(value: SkillsTaxonomyAndRoleMapping) {
  const validationErrors = validateSkillsTaxonomyAndRoleMapping(value);
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
    decision: evaluateSkillsTaxonomyAndRoleMapping(value)
  };
}
